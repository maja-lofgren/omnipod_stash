import { useEffect, useRef } from "react";
/**
 * This useInterval Hook sets up an interval and clears it after the component unmounts. 
 * It’s a combo of setInterval() and clearInterval(), but all wrapped into one easy-to-implement Hook.
 * https://blog.bitsrc.io/polling-in-react-using-the-useinterval-custom-hook-e2bcefda4197
 */
export function useInterval(callback, delay) {
    const savedCallback = useRef();
    //Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    //set up interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay != null){
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }
    }, [callback, delay]);
}