'use strict';

const statusNumers = {
    success: 200,
};

const onSuccses = (data) => {
    console.log(data);
};

const onError = (message) => {
    console.error(message);
};

const load = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function(evt) {
        if (xhr.status === statusNumers.success) {
            onSuccses(xhr.response);
        } else {
            onError(`Статус ответа ${xhr.status} ${xhr.statusText}`);
        }
    });

    xhr.addEventListener('error', function(evt) {
        onError('Произоша ошибка соединения');
    });
    xhr.addEventListener('timeout', function(evt) {
        onError(`Запрос не выполнился за ${xhr.timeout} мс`);
    });

    xhr.timeout = 10000;
    xhr.open('GET', url);
    xhr.send();

};


export default load;
