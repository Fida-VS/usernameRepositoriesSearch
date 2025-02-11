export function debounce(func: (...args: any[]) => void, delay: number) {  
    let timeoutId: ReturnType<typeof setTimeout>;  

    return (...args: any[]) => {  
        if (timeoutId) {  
            clearTimeout(timeoutId); // Очищаем предыдущий таймер  
        }  
        timeoutId = setTimeout(() => {  
            func(...args); // Вызываем функцию после задержки  
        }, delay);  
    };  
} 