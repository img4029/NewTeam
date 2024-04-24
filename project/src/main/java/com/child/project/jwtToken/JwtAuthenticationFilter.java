package com.child.project.jwtToken;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// ** 인증필터(AuthenticationFilter) 클래스 만들기 & 등록하기
// => 등록: SecurityConfig.java 의 filterChain 메서드 참고
// => 스프링 시큐리티의 filter는
//	  javax.servlet.Filter 인터페이스를 구현해서 커스텀 Filter를 구현할 수 있다
// => OncePerRequestFilter 상속받아 생성
// => Filter(i) -> GenericFilterBean(a) -> OncePerRequestFilter(a)
//    -> JwtAuthenticationFilter

// ** OncePerRequestFilter
// => https://hongdosan.tistory.com/entry/JWT-OncePerRequestFilter-Filter
// => 원문번역
//	  어느 Servlet Container 에서나 요청당 한번의 실행을 보장하는것을 목표로 한다.
//	  doFilterInternal 메소드와 HttpServletRequest 와 HttpServletResponse 인자를 제공한다.
//	  즉, 요청당 한번의 실행을 보장한다.

// => 요약하면 OncePerRequestFilter 는
//	  모든 서블릿에 일관된 요청을 처리하기 위해 만들어진 Filter.
//	  이 추상 클래스를 구현한 Filter는 사용자의 요청당 딱 한번만 실행되는 Filter를 만들수있다.
// => 비교하면 Filter 또는 Filter를 더 확장한 GenericFilterBean 을 상속받아 사용하는 경우에는
//    앞서 거친 Filter들을 또한번 거치는, 쓸데없는 자원낭비가 일어나는데 이를 방지해준다.

// ** doFilter() 와 doFilterInternal()
// => 인증처리를 담당함.
// => 일반적으로 구현된 필터는 아래 두가지 케이스가 존재함.

// => Filter인터페이스의 doFilter를 직접 구현한 필터
//	  doFilter메서드를 호출하면 사용자가 구현한 로직이 바로 실행

// => Filter인터페이스의 doFilter를 구현한 필터클래스를 상속하여 doFilterInternal 을 구현한 필터
//	  위의 OncePerRequest필터처럼 doFilter메서드를 OncePerRequest필터 안에서 구현하고
//	  doFilter에서 doFilterInternal을 호출하는 방식이다.
//	  doFilterInternal은 추상메서드 이므로 사용자가 직접 구현해야함 (아래코드 참고)

// ** doFilter
// => url-pattern에 맞는 모든 HTTP 요청이 디스패처 서블릿으로 전달되기 전에 웹 컨테이너에 의해 실행되는 메소드
//    doFilter의 파라미터로는 FilterChain이 있는데, FilterChain의 doFilter 통해 다음 대상으로 요청을 전달하게 된다.
//    chain.doFilter() 전/후에 우리가 필요한 처리 과정을 넣어줌으로써 원하는 처리를 진행할 수 있다.
//  
// => 스프링 Filter 동작과정
//	https://emgc.tistory.com/125
//	https://mangkyu.tistory.com/173 참고
// ---------------------------------------------------------

// ** String 의 주요메서드
// => startsWith() : 어떤 String이 특정 문자열로 시작하는지를 boolean 타입으로 리턴
// => endsWith() : 특정 문자열로 끝나는지 boolean 타입으로 리턴.
// => a.equalsIgnoreCase(b) : a와 b가 똑같은지 확인하는 메서드이며, 대소문자 구분없이 비교함.

@Slf4j // @Log4j2 둘중선택
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private TokenProvider tokenProvider;

	// => doFilterInternal 메서드는 인증처리를 담당
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			// 1) request 에서 토큰 가져오기.
			String token = parseBearerToken(request);
			log.info("** TokenProvider.java, doFilterInternal(), token 확인=> " + token);
			if (token != null && !token.equalsIgnoreCase("null")) {

				// 2) 토큰 검증 & claims 가져오기
				Map<String, Object> claims = tokenProvider.validateToken(token);
				log.info("** Authenticated 결과 JWT claims: " + claims);
				String userId = (String) claims.get("userId");
				// String pw = (String) claims.get("pw");
				List<String> roleList = (List<String>) claims.get("roleList");
				log.info("** roleList 확인=> " + roleList);

				AbstractAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						userId,
						null, // Password를 의미하며 보통은 null 로 처리
						roleList.stream()
								.map(str -> new SimpleGrantedAuthority("ROLE_" + str))
								.collect(Collectors.toList()));

				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				// => details 필드에 인증 소스인 request 값 set

				// => SecurityContextHolder에 인증된 user등록.
				// SecurityContextHolder에 등록해야 인증된 user라고 생각하고, user를 인식한다.
				// -> SecurityContextHolder.createEmptyContext() 메서드로 SecurityContext 생성하고
				// -> 여기에 SecurityContext 에 인증정보를 넣고
				// -> 다시 SecurityContextHolder 에 컨텍스트로 등록함.
				SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
				securityContext.setAuthentication(authentication);
				SecurityContextHolder.setContext(securityContext);
			}
		} catch (Exception ex) {
			logger.error("Could not set user authentication in security context", ex);
		}

		filterChain.doFilter(request, response);

	}

	// ** Bearer Token
	// => HTTP통신에서 사용하는 인증 방식에 Bearer Authentication을 사용하는 것이다.
	// => Bearer Authentication이란, "이 토큰을 나르는(bearer) 사람에게 권한을 부여하시오"라는 것

	// ** StringUtils
	// => import org.springframework.util.StringUtils;
	// => 거의 대부분의 문자열 처리를 수행할 수 있음.
	// => 파라미터 값으로 null을 주더라도 NullPointException을 발생시키지 않고,
	// 메서드에 따라 알맞은 결과를 리턴한다.
	// => 주요 method 정리
	// - hasText() : null, 길이 0, 공백("" or " ") 중 하나라도 있으면 false를 반환함.
	// - hasLength() : null 체크 후, 길이가 0인지 판별한다.
	// ( 공백만 있는 문자열, " " 도 true가 반환되는 점을 주의 )
	// 공백으로만 이루어졌더라도 상관없이 null 체크와 길이가 1 이상인지 확인할때 사용.
	// - isEmpty() : null, 길이 0, 공백("" or " ") 중 하나라도 있으면 false를 반환함. (위의 hasText()
	// 권장함)
	// - deleteWhitespace() , trim() : 문자열에 공백 문자가 있으면 모두 제거
	// - equals() : 파라미터 값의 동일성

	private String parseBearerToken(HttpServletRequest request) {
		// => Http request 의 헤더를 파싱해 Bearer 토큰을 리턴한다.

		String bearerToken = request.getHeader("Authorization");
		if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return null;
	}
} // class
