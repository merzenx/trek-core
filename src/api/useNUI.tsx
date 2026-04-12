import { useEffect, useState, useCallback, useRef } from "react";

interface NUIOptions {
    body?: any;
}

/**
 * Hook for fetching data from NUI
 * @param endpoint 
 * @param options 
 */

export const useNUI = (endpoint: string, options: NUIOptions = {}) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const resourceName = useRef((window as any).GetParentResourceName ? (window as any).GetParentResourceName() : "nui-res-name").current;

    const sendNUI = useCallback(async (endPointStr: string, opts?: NUIOptions) => {
        const response = await fetch(`https://${resourceName}/${endPointStr}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(opts?.body || {}),
        });

        if (!response.ok) {
            throw new Error(`NUI Error: ${response.statusText}`);
        }

        return await response.json();
    }, [resourceName]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await sendNUI(endpoint, options);
            setData(result);
        } catch (err) {
            setError(err as Error);
            console.error(`Failed to fetch NUI endpoint: ${endpoint}`, err);
        } finally {
            setLoading(false);
        }
    }, [endpoint, options, sendNUI]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const { type, data: eventData } = event.data;
            if (type === endpoint) {
                setData(eventData);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [endpoint]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
    };
};

/**
 * Hook for listening to NUI events
 * @param action 
 * @param handler 
 */
export const useNUIEvent = <T = any>(action: string, handler: (data: T) => void) => {
    const savedHandler = useRef<(data: T) => void>(() => { });

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const messageListener = (event: MessageEvent) => {
            const { action: eventAction, data } = event.data;

            if (savedHandler.current && eventAction === action) {
                savedHandler.current(data);
            }
        };

        window.addEventListener("message", messageListener);

        return () => window.removeEventListener("message", messageListener);
    }, [action]);
};