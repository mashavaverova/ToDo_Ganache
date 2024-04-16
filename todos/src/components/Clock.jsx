
import { useState, useEffect } from 'react';
export const Clock = () => {
        let [date, setDate] = useState(new Date());
        let intervalId = '';

        useEffect(() => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            intervalId = setInterval(
            tick,
             1000);
            return () => {
                clearInterval(intervalId);
            };

        }, [date]

        );
        function tick (){
            setDate(new Date());
        }
 
        return(
        <div className="clock">
            {date.toLocaleTimeString()}
        </div>
        )
    
}
