package com.child.project.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.child.project.entity.Program;
import com.child.project.entity.ProgramDetails;
import com.child.project.entity.ProgramDetailsId;
import com.child.project.entity.ProgramId;
import com.child.project.service.ProgramService;

import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping(value = "/api/prg")
@AllArgsConstructor // 개별적으로 @Autowired 하지않아도 된다. 생략가능
public class ProgramController {

	ProgramService prgService;

	@GetMapping("/prgList")
	public List<Program> prgList() {

		List<Program> list = prgService.selectList();

		return list;
	} // prgList

	@GetMapping("/prgSearch")
	public List<Program> prgSearch(Program entity) {
		log.info(" prgList 도착 ");
		List<Program> list = prgService.findSearch(entity);

		return list;
	} // prgList

	@GetMapping("/prgDetails")
	public List<ProgramDetails> prgDetails(@RequestParam("prgId") String prgId,
			@RequestParam("rec") String rec, HttpServletRequest request) throws IOException {

		List<ProgramDetails> list = prgService.selectDetails(prgId, rec);

		return list;
	} // prgDetails

	// @RequestBody
	@PostMapping("/prgSave")
	public String prgInsert(@RequestBody Program entity) {
		String message = "";
		// LocalDate now = LocalDate.now(); // 포맷 정의
		// DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMdd");
		// String formatedNow = now.format(formatter);

		entity.setPrgId(entity.getPrgBigCls() + entity.getPrgMidCls() + entity.getPrgSubCls());
		if (prgService.saveCat(entity.getPrgBigCls(), entity.getPrgMidCls(), entity.getPrgSubCls()) == 0
				&& "prgInsert".equals(entity.getType())) {
			try {
				log.info(" program insert 성공 => " + prgService.save(entity));
				message = "신규생성에 성공 했습니다.";
			} catch (Exception e) {
				log.info(" program insert Exception => " + e.toString());
				message = "신규생성에 실패 했습니다. 관리자에게 문의하세요.";
			}
		} else if (prgService.saveCat(entity.getPrgBigCls(), entity.getPrgMidCls(), entity.getPrgSubCls()) == 1
				&& "prgUpdate".equals(entity.getType())) {
			try {
				log.info(" program Update 성공 => " + prgService.save(entity));
				message = "저장에 성공 했습니다.";
			} catch (Exception e) {
				log.info(" program Update Exception => " + e.toString());
				message = "저장에 실패 했습니다. 관리자에게 문의하세요.";
			}
		} else if ("prgInsert".equals(entity.getType())) {
			message = "신규생성에 실패 했습니다. 같은 프로그램이 있는지 확인하세요.";
		} else if ("prgUpdate".equals(entity.getType())) {
			message = "저장에 실패 했습니다. 관리자에게 문의하세요.";
		} else {
			message = "요청에 실패했습니다. 관리자에게 문의하세요.";
		}

		return message;
	}

	// @PostMapping("/prgDtInsert")
	@PostMapping("/prgDtSave")
	public String prgDtSave(
			@RequestBody ProgramDetails entity, HttpServletRequest request)
			throws IOException {
		String message = "";

		// // 1.1) 현제 웹어플리케이션의 실질적인 실행위치 확인
		String realPath = request.getRealPath("/");
		log.info("** realPath => " + realPath);

		// // 1.2) realPath 를 이용해서 물리적 저장위치 (file1) 확인
		if (!realPath.contains("apache-tomcat"))
			realPath = "C:\\Mtest\\childProject\\project\\src\\main\\webapp\\resources\\uploadFile\\"
					+ entity.getPrgId() + entity.getPrgDnm() + "\\"; // 개발중.
		else
			realPath = "E:\\Mtest\\IDESet\\apache-tomcat-9.0.85\\webapps\\project\\resources\\uploadFile\\"
					+ entity.getPrgId() + entity.getPrgDnm() + "\\";

		// // 1.3 폴더 만들기 (없을수도 있음을 가정, File 클래스)
		File file = new File(realPath);
		if (!file.exists()) {
			// 저장 폴더가 존재하지 않는경우 만들어줌
			file.mkdir();
		}

		if (entity.getPrgId() != null && entity.getPrgDnm() != null && "prgDtInsert".equals(entity.getType())
				&& prgService.detailsCnt(entity.getPrgId(), entity.getPrgDnm()) == 0) {
			try {
				if (entity.getPrgFile() == "") {
					entity.setPrgFile("programDefault.png");
				}
				entity.getPrgFile();
				log.info(" program insert 성공 => " + prgService.dtSave(entity));
				message = "신규생성에 성공 했습니다.";
			} catch (Exception e) {
				log.info(" program insert Exception => " + e.toString());
				return "신규생성에 실패 했습니다. 관리자에게 문의하세요.";
			}
		} else if (entity.getPrgId() != null && entity.getPrgDnm() != null && "prgDtUpdate".equals(entity.getType())
				&& prgService.detailsCnt(entity.getPrgId(), entity.getPrgDnm()) > 0) {
			try {
				log.info(" program Update 성공 => " + prgService.dtSave(entity));
				message = "저장에 성공 했습니다.";
			} catch (Exception e) {
				log.info(" program Update Exception => " + e.toString());
				return "저장에 실패 했습니다. 관리자에게 문의하세요.";
			}
		} else {
			return "신규생성에 실패 했습니다.\n같은 세부프로그램명이 존재합니다.";
		}

		// // ** File Copy 하기 (IO Stream)
		file = new File(realPath + "programDefault.png"); // uploadImages 폴더에 화일존재
		if (!file.isFile() && entity.getPrgFilef() == null) { // 존재하지않는 경우
			String basicImagePath;
			if (!realPath.contains("apache-tomcat"))
				basicImagePath = "C:\\Mtest\\childProject\\project\\src\\main\\webapp\\resources\\images\\programDefault.png";
			else
				basicImagePath = "E:\\Mtest\\IDESet\\apache-tomcat-9.0.85\\webapps\\project\\resources\\images\\programDefault.png";
			FileInputStream fi = new FileInputStream(new File(basicImagePath));
			// => uploadImages 읽어 파일 입력바이트스트림 생성
			FileOutputStream fo = new FileOutputStream(file);
			// => 목적지 파일(realPath+"basicman4.png") 출력바이트스트림 생성
			FileCopyUtils.copy(fi, fo);
		}

		return message;
	}

	@PostMapping("/fileUpload")
	public String prgDtUpdate(@RequestParam("prgFilef") List<MultipartFile> prgFilef,
			@RequestParam("prgId") String prgId, @RequestParam("prgDnm") String prgDnm, HttpServletRequest request)
			throws IOException {

		// // 1.1) 현제 웹어플리케이션의 실질적인 실행위치 확인
		String realPath = request.getRealPath("/");
		log.info("** realPath => " + realPath);
		// // 1.2) realPath 를 이용해서 물리적 저장위치 (file1) 확인
		if (!realPath.contains("apache-tomcat"))
			realPath = "C:\\Mtest\\childProject\\project\\src\\main\\webapp\\resources\\uploadFile\\"
					+ prgId + prgDnm + "\\"; // 개발중.
		else
			realPath = "E:\\Mtest\\IDESet\\apache-tomcat-9.0.85\\webapps\\project\\resources\\uploadFile\\"
					+ prgId + prgDnm + "\\";

		// // 1.4) 저장경로 완성
		String file1 = "";
		// List<MultipartFile> uploadfilef = entity.getPrgFilef();
		if (prgFilef != null && !prgFilef.isEmpty()) {
			for (MultipartFile f : prgFilef) {
				File delFile = new File(realPath + f);
				if (delFile.isFile())
					delFile.delete(); // file 존재시 삭제
				file1 = realPath + f.getOriginalFilename(); // 저장경로 완성
				f.transferTo(new File(file1));
			}
		}

		return "파일 저장 완료";
	}

	@GetMapping("/filedownload")
	public ResponseEntity<Object> download(@RequestParam("prgId") String prgId, @RequestParam("prgDnm") String prgDnm,
			@RequestParam("fileName") String fileName, HttpServletRequest request) {

		// // 1.1) 현제 웹어플리케이션의 실질적인 실행위치 확인
		String realPath = request.getRealPath("/");
		log.info("** realPath => " + realPath);
		// // 1.2) realPath 를 이용해서 물리적 저장위치 (file1) 확인
		if (!realPath.contains("apache-tomcat"))
			realPath = "C:\\Mtest\\childProject\\project\\src\\main\\webapp\\resources\\uploadFile\\"
					+ prgId + prgDnm + "\\"; // 개발중.
		else
			realPath = "E:\\Mtest\\IDESet\\apache-tomcat-9.0.85\\webapps\\project\\resources\\uploadFile\\"
					+ prgId + prgDnm + "\\";
		try {
			// 파일 경로 생성
			Path filePath = Paths.get(realPath).resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());

			// 파일이 존재하는지 확인
			if (resource.exists()) {
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
				headers.setContentDispositionFormData("attachment", fileName);

				return ResponseEntity.ok()
						.headers(headers)
						.body(resource);
			} else {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
			}
		} catch (MalformedURLException ex) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File path is invalid", ex);
		} catch (IOException ex) {
			throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read file", ex);
		}
	}

	// @GetMapping("/filedownload")
	// public ResponseEntity<Object> download(@RequestParam("prgId") String prgId,
	// @RequestParam("prgDnm") String prgDnm,
	// @RequestParam("fileName") String fileName,HttpServletRequest request) {
	// // // 1.1) 현제 웹어플리케이션의 실질적인 실행위치 확인
	// String realPath = request.getRealPath("/");
	// log.info("** realPath => " + realPath);
	// // // 1.2) realPath 를 이용해서 물리적 저장위치 (file1) 확인
	// if (!realPath.contains("apache-tomcat"))
	// realPath =
	// "C:\\Mtest\\childProject\\project\\src\\main\\webapp\\resources\\uploadFile\\"
	// + prgId + prgDnm + "\\"; // 개발중.
	// else
	// realPath =
	// "E:\\Mtest\\IDESet\\apache-tomcat-9.0.85\\webapps\\project\\resources\\uploadFile\\"
	// + prgId + prgDnm + "\\";

	// try {
	// Path filePath = Paths.get(realPath);
	// Resource resource = new InputStreamResource(Files.newInputStream(filePath));
	// // 파일 resource 얻기

	// File file = new File(realPath);

	// HttpHeaders headers = new HttpHeaders();
	// headers.setContentDisposition(ContentDisposition.builder("attachment").filename(file.getName()).build());
	// // 다운로드 되거나 로컬에 저장되는 용도로 쓰이는지를 알려주는 헤더

	// return new ResponseEntity<Object>(resource, headers, HttpStatus.OK);
	// } catch(Exception e) {
	// return new ResponseEntity<Object>(null, HttpStatus.CONFLICT);
	// }
	// }

	@PostMapping("/prgdelete")
	public String prgdelete(@RequestBody ProgramId entityId) {
		String message = "";

		try {
			prgService.deleteById(entityId);
			log.info(" member delete 성공 ");
			message = "삭제에 성공 했습니다.";
		} catch (Exception e) {
			log.info(" member delete Exception => " + e.toString());
			message = "삭제에 실패 했습니다. 관리자에게 문의하세요.";
		}

		return message;
	}

	@PostMapping("/prgDtdelete")
	public String prgdelete(@RequestBody ProgramDetailsId entityId) {
		String message = "";

		try {
			prgService.deleteDtById(entityId);
			log.info(" member delete 성공 ");
			message = "삭제에 성공 했습니다.";
		} catch (Exception e) {
			log.info(" member delete Exception => " + e.toString());
			message = "삭제에 실패 했습니다. 관리자에게 문의하세요.";
		}

		return message;
	}

	@GetMapping("/hi")
	public String hi() {

		return "hi";
	} // prgList
}
