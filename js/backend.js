'use strict';

import * as utils from './utils.js';

const xhrStatus = {
    'OK': 200,
};
export let data;

export function ajaxGetRequest(onSuccessCb, onError = errorHandler) {

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    const url = 'https://javascript.pages.academy/kekstagram/data';
    xhr.responseType = 'json';

    xhr.addEventListener('load', function() {
        if (xhr.status === xhrStatus.OK) {
            onSuccessCb(xhr.response);
            data = xhr.response;
        } else {
            onError(`Запрос не удался: ${xhr.statusText}`);
        }
    });

    xhr.addEventListener('error', function() {
        onError('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function() {
        onError(`Сервер не отвеает в течение ${xhr.timeout} мс`);
    });

    xhr.timeout = 10000;
    xhr.open('GET', url);
    xhr.send();

}

export function ajaxPostRequest(data, onSuccess, onError = errorHandler) {
    const xhr = new XMLHttpRequest();
    const url = 'https://javascript.pages.academy/kekstagram';
    xhr.addEventListener('load', function() {
        if (xhr.status === xhrStatus.OK) {
            onSuccess();
        } else {
            onError(`Запрос не удался: ${xhr.statusText}`);
        }
    });

    xhr.addEventListener('error', function() {

        errorHandler('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function() {
        onError(`Сервер не отвеает в течение ${xhr.timeout} мс`);
    });

    xhr.timeout = 10000;
    xhr.open('POST', url);
    xhr.send(data);
}

export function successHandler(message) {
    const newElement = document.querySelector('#success').
        content.
        querySelector('.success').
        cloneNode(true);
    newElement.querySelector('.success__title').textContent = message;
    newElement.querySelector('.success__button').
        addEventListener('click', function() {
            newElement.remove();
        });
    document.addEventListener('keydown', function(e) {
        if (utils.isEscPressed(e)) {
            newElement.querySelector('.success__button').
                click();
        }

    }, {'once': true});
    document.body.append(newElement);
}

export function errorHandler(message) {
    const newElement = document.querySelector('#error').
        content.
        querySelector('.error').
        cloneNode(true);
    newElement.querySelector('.error__title').textContent = message;
    newElement.querySelector('.error__button').
        addEventListener('click', function() {
            newElement.remove();
            resetToDefault();
        });
    document.addEventListener('keydown', function(e) {
        if (utils.isEscPressed(e)) {
            newElement.querySelector('.error__button').
                click();
        }
        resetToDefault();
    }, {'once': true});
    document.body.append(newElement);
}

