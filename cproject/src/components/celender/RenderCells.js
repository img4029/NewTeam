import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { isSameMonth, isSameDay, addDays, parse } from 'date-fns';
import axios from 'axios';

function RenderCells({ currentMonth, selectedDate, onDateClick }) {
    const [stfAtn, setStfAtn] = useState([]);
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    useEffect(() => {
        axios.get(`/api/staff/staffAtnList`)
            .then((response) => {
                console.log(response.data)
                setStfAtn(response.data);
            }).catch((error) => {
                // handle error
                console.log(error);
            })
    },[])
    console.log(stfAtn);
    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            let coler;
            if (i === 0) {
                coler = 'colRed';
            } else if (i === 6) {
                coler = 'colBlue';
            } 
            formattedDate = format(day, 'd');
            const cloneDay = day;
            days.push(
                <div
                    className={`col cell ${!isSameMonth(day, monthStart)
                        ? 'disabled'
                        : isSameDay(day, selectedDate)
                            ? 'selected'
                            : format(currentMonth, 'M') !== format(day, 'M')
                                ? 'not-valid'
                                : 'valid'
                        } ${coler}`}
                    key={day}
                    // onClick={() => {
                    //     console.log(parse(cloneDay))
                    //     onDateClick(parse(cloneDay))
                    // }}
                >
                    <span
                        className={
                            format(currentMonth, 'M') !== format(day, 'M')
                                ? 'text not-valid'
                                : ''
                        }
                    >
                        {formattedDate}
                    </span>
                </div>,
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="row" key={day}>
                {days}
            </div>,
        );
        days = [];
    }
    return <div className="body">{rows}</div>;
};
export default RenderCells;