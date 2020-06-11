(function (exports) {
    'use strict';

    const escEventCode = 'Escape';
    let elementToClose;

    const isEscPressed = evt => evt.code === escEventCode;

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const escPressHandler = evt => {
      if (isEscPressed(evt)) {
        closeElement(elementToClose);
        deleteBlobImage();
      }
    };

    const openElement = element => {
      element.classList.remove('hidden');
      elementToClose = element;
      document.addEventListener('keydown', escPressHandler);
    };

    const closeElement = element => {
      element.classList.add('hidden');
      document.removeEventListener('keydown', escPressHandler);
      document.body.classList.remove('modal-open');
      resetToDefault();
      form.reset();
    };

    function classToggler(arrToclear, element) {
      arrToclear.forEach(item => item.classList.remove('img-filters__button--active'));
      element.classList.add('img-filters__button--active');
    }

    const xhrStatus = {
      OK: 200
    };
    let data;
    function ajaxGetRequest(onSuccessCb, onError = errorHandler) {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      const url = 'https://javascript.pages.academy/kekstagram/data';
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === xhrStatus.OK) {
          onSuccessCb(xhr.response);
          data = xhr.response;
        } else {
          onError(`Запрос не удался: ${xhr.statusText}`);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError(`Сервер не отвеает в течение ${xhr.timeout} мс`);
      });
      xhr.timeout = 10000;
      xhr.open('GET', url);
      xhr.send();
    }
    function ajaxPostRequest(data, onSuccess, onError = errorHandler) {
      const xhr = new XMLHttpRequest();
      const url = 'https://javascript.pages.academy/kekstagram';
      xhr.addEventListener('load', function () {
        if (xhr.status === xhrStatus.OK) {
          onSuccess();
        } else {
          onError(`Запрос не удался: ${xhr.statusText}`);
        }
      });
      xhr.addEventListener('error', function () {
        errorHandler('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError(`Сервер не отвеает в течение ${xhr.timeout} мс`);
      });
      xhr.timeout = 10000;
      xhr.open('POST', url);
      xhr.send(data);
    }
    function errorHandler(message) {
      let newElement = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
      newElement.querySelector('.error__title').textContent = message;
      newElement.querySelector('.error__button').addEventListener('click', function () {
        newElement.remove();
        resetToDefault();
      });
      document.addEventListener('keydown', function (e) {
        if (isEscPressed(e)) newElement.querySelector('.error__button').click();
        resetToDefault();
      }, {
        once: true
      });
      document.body.append(newElement);
    }

    const uploadSection = document.querySelector('.img-upload');
    const uploadButton = uploadSection.querySelector('#upload-file');
    const form = uploadSection.querySelector('form');
    const editForm = uploadSection.querySelector('.img-upload__overlay');
    const imageInput = uploadSection.querySelector('.img-upload__input');
    const editFormCloseButton = uploadSection.querySelector('.img-upload__cancel');
    const previewPhoto = uploadSection.querySelector('.img-upload__preview');
    const previewPhotoImg = uploadSection.querySelector('.img-upload__preview img');
    const scaleControlMinus = uploadSection.querySelector('.scale__control--smaller');
    const scaleControlPlus = uploadSection.querySelector('.scale__control--bigger');
    const scaleControlInput = uploadSection.querySelector('.scale__control--value');
    const effectPreviewImg = uploadSection.querySelectorAll('.effects__preview');
    const effectElement = uploadSection.querySelector('.effect-level');
    const effectValue = uploadSection.querySelector('.effect-level__value');
    const effectsBlock = uploadSection.querySelector('.effects__list');
    const checkedRadio = uploadSection.querySelector('input[checked]');
    const effectDepth = uploadSection.querySelector('.effect-level__depth');
    const pinLevelLine = document.querySelector('.effect-level__line');
    const pin = uploadSection.querySelector('.effect-level__pin');
    const hashTag = uploadSection.querySelector('.text__hashtags');
    const effectValueToClassName = {
      chrome: `effects__preview--chrome`,
      sepia: `effects__preview--sepia`,
      marvin: `effects__preview--marvin`,
      phobos: `effects__preview--phobos`,
      heat: `effects__preview--heat`
    };
    const effectValueToFilterName = {
      chrome: `grayscale`,
      sepia: `sepia`,
      marvin: `invert`,
      phobos: `blur`,
      heat: `brightness`
    };
    const effectValueTofilterCallback = {
      chrome: index => {
        let cssIndex = index / pinLevelLine.offsetWidth;
        previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
      },
      sepia: index => {
        let cssIndex = index / pinLevelLine.offsetWidth;
        previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
      },
      marvin: index => {
        let cssIndex = index / pinLevelLine.offsetWidth * 100 + '%';
        previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
      },
      phobos: index => {
        let cssIndex = index * 3 / pinLevelLine.offsetWidth + 'px';
        previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
      },
      heat: index => {
        let cssIndex = 1 + 2 * index / pinLevelLine.offsetWidth;
        previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
      }
    };
    const transformToCallback = {
      scale: index => {
        let cssIndex = parseInt(index) / 100;
        previewPhoto.style.transform = `scale(${cssIndex})`;
      }
    }; //----Переменные для обработчиков событий----//

    let clickedClass;
    let clickedNode;
    let currentFilter;
    let filterCallback; //----Сброс значений по умолчанию----//

    function resetToDefault() {
      if (clickedClass) previewPhoto.classList.remove(clickedClass);

      if (clickedNode && clickedNode.value !== 'none') {
        effectElement.classList.remove('hidden');
        effectValue.value = 100;
      } else {
        effectElement.classList.add('hidden');
        effectValue.value = 0;
      }

      pin.style.left = '100%';
      effectDepth.style.width = '100%';
      previewPhoto.style.filter = '';
      previewPhoto.style.transform = 'scale(1)';
      scaleControlInput.value = '100%';
      hashTag.style.outline = '';
    }

    function scaleMinusClickHandler(callback) {
      let scaleStep = 25;
      let scaleValue = parseInt(scaleControlInput.value);
      if (scaleValue > scaleStep) scaleControlInput.value = scaleValue - scaleStep + '%';
      callback(scaleControlInput.value);
    }

    function scalePlusClickHandler(callback) {
      let scaleStep = 25;
      let maxScale = 100;
      let scaleValue = parseInt(scaleControlInput.value);
      if (scaleValue < maxScale) scaleControlInput.value = scaleValue + scaleStep + '%';
      callback(scaleControlInput.value);
    }

    function effectChangeHandler(evt) {
      clickedNode = evt.target;
      resetToDefault();
      currentFilter = effectValueToFilterName[evt.target.value];
      filterCallback = effectValueTofilterCallback[evt.target.value];
      clickedClass = effectValueToClassName[evt.target.value];
      if (clickedClass) previewPhoto.classList.add(clickedClass);
    }

    function pinMouseDownHandler(event, callback) {
      event.preventDefault();
      let shiftX = event.clientX - pin.getBoundingClientRect().left;

      function mouseMoveHandler(event) {
        event.preventDefault();
        let newLeft = event.clientX - shiftX - pinLevelLine.getBoundingClientRect().left;

        if (newLeft < 0) {
          newLeft = 0;
        }

        let rightEdge = pinLevelLine.offsetWidth;

        if (newLeft > rightEdge) {
          newLeft = rightEdge;
        }

        pin.style.left = newLeft + 'px';
        effectDepth.style.width = newLeft + 'px';
        let inputValueOfEfLevel = newLeft / pinLevelLine.offsetWidth * 100;
        effectValue.value = Math.round(inputValueOfEfLevel);
        if (callback) callback(newLeft);
      }

      function mouseUpHandler() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      }
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);

      pin.ondragstart = function () {
        return false;
      };
    }

    function showBlobImg() {
      const blobImage = imageInput.files[0];
      previewPhotoImg.src = URL.createObjectURL(blobImage);

      for (let item of effectPreviewImg) {
        item.style.backgroundImage = `url('${URL.createObjectURL(blobImage)}')`;
      }
    }

    function deleteBlobImage() {
      const blobImage = imageInput.files[0];

      for (let item of effectPreviewImg) {
        item.style.backgroundImage = `url('${URL.revokeObjectURL(blobImage)}')`;
      }
    }

    scaleControlPlus.addEventListener('click', function () {
      scalePlusClickHandler(transformToCallback.scale);
    });
    scaleControlMinus.addEventListener('click', function () {
      scaleMinusClickHandler(transformToCallback.scale);
    });
    effectsBlock.addEventListener('change', effectChangeHandler);
    uploadButton.addEventListener('change', function () {
      openElement(editForm);
      showBlobImg();
    });
    editFormCloseButton.addEventListener('click', function () {
      closeElement(editForm);
      deleteBlobImage();
    });
    pin.addEventListener('mousedown', function (event) {
      pinMouseDownHandler(event, filterCallback);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      ajaxPostRequest(new FormData(form), function () {
        closeElement(editForm);
      });
    }); //----Значения по умолчанию----//

    effectValue.setAttribute('value', 0);
    scaleControlInput.setAttribute('value', '100');
    closeElement(effectElement);

    setTimeout(function () {
      filterIdToData['filter-default'] = data;
    }, 500);
    const filterIdToData = {
      // 'filter-discussed': returnDataofFn,
      // 'filter-random': returnDataofFn,
      'filter-default': data
    };
    function sortByPopularity(data) {
      let dataCopy = data.slice();
      let newArr = dataCopy.sort((a, b) => {
        return b.comments.length - a.comments.length;
      });
      filterIdToData['filter-discussed'] = newArr;
      return newArr;
    }
    function sortByRandom(data) {
      let randomNumbers = [];

      while (randomNumbers.length < 10) {
        let random = getRandomInt(25);

        if (!randomNumbers.some(item => item === random)) {
          randomNumbers.push(random);
        }
      }

      let randomArray = randomNumbers.map(item => {
        return data[item];
      });
      filterIdToData['filter-random'] = randomArray;
      return randomArray;
    }

    const uploadSocialButton = document.querySelector('.comments-loader');
    const bigPicture = document.querySelector('.big-picture');
    const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
    const bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
    const likesCount = bigPicture.querySelector('.likes-count');
    const photoDiscrition = bigPicture.querySelector('.social__caption');
    const socialCommentblock = document.querySelector('.social__comments');
    const comments = socialCommentblock.children;
    const blockOfcomments = bigPicture.querySelector('.social__comment-count');
    const commentsCount = bigPicture.querySelector('.comments-count');
    const commentText = document.querySelectorAll('.social__text');
    const socialAvatar = bigPicture.querySelector('.social__picture');
    const loadCommentButton = bigPicture.querySelector('.social__comments-loader');
    const commentInput = bigPicture.querySelector('.social__footer-text');
    const uploadComment = bigPicture.querySelector('.social__footer-btn'); // const picture = document.querySelector('.pictures').shadowRoot.querySelector('.picture__comments')

    const commentTemplate = document.querySelector('#comment').content.querySelector('.social__comment'); //----Переменные----//

    let commentCount;
    let clickedItem; //----Навешивает данные на полноэкранное изображение----//

    function bigPictureClickHandler(evt, data) {
      clickedItem = evt.target;
      commentCount = data.comments.length;
      appendPictureData(data);
      deleteNodes(comments);
      renderCommentElements(data, socialCommentblock);
    } //----Обновляет инфо о кол-ве комментов----//

    function showCurrentCommentsCount() {
      if (commentCount > 4) blockOfcomments.textContent = `5 из ${commentCount} комментариев`;else if (commentCount === 1) blockOfcomments.textContent = `${commentCount} комментарий`;else blockOfcomments.textContent = `${commentCount} комментария`;
    } //----Добавляет инфо на полноэкранное фото----//


    function appendPictureData(data) {
      bigPictureImg.src = data.url;
      likesCount.textContent = data.likes;
      photoDiscrition.textContent = data.description;
      socialAvatar.src = `img/avatar-${Math.ceil(Math.random() * 6)}.svg`;
      loadCommentButton.classList.remove('hidden');
      showCurrentCommentsCount();
    } //----Удаляет эллементы----//


    function deleteNodes(elements) {
      while (elements[0]) {
        elements[0].remove();
      }
    } //----Элемент для нового коммента----//


    function makeCommentElement(data, index) {
      let newElement = commentTemplate.cloneNode(true);
      newElement.querySelector('.social__picture').src = data.avatar;
      newElement.querySelector('.social__text').textContent = data.message;
      if (index) newElement.classList.add('hidden');
      return newElement;
    } //----Рендерит на страницу имеющиеся комменты в базе данных----//


    function renderCommentElements(data, container) {
      let fragment = document.createDocumentFragment();
      data.comments.forEach((item, index) => {
        if (index > 4) {
          fragment.appendChild(makeCommentElement(item, index));
        } else {
          fragment.appendChild(makeCommentElement(item));
        }
      });
      container.append(fragment);
    } //----Показывает скрытые комментарии----//


    function showHiddenComments() {
      for (let comment of comments) {
        comment.classList.remove('hidden');
      }

      loadCommentButton.classList.add('hidden');
    } //----Добавляет новый коммент----//


    function addComment(callback) {
      let avatar = `img/avatar-${Math.ceil(Math.random() * 6)}.svg`;
      socialCommentblock.insertAdjacentElement('afterbegin', makeCommentElement({
        message: commentInput.value,
        avatar: avatar
      }));
      commentCount += 1;
      callback(avatar, commentInput.value);
      commentInput.value = '';
    } //----Обновляет количество комментов на мини фотках----//


    function fakePushToServer(avatar, comment) {
      data.find(item => {
        return clickedItem.src.match(/\d+\.jpg$/)[0] === item.url.match(/\d+\.jpg$/)[0];
      }).comments.unshift({
        avatar: avatar,
        message: comment
      });
      clearPictures();
      renderPictureElements(filterIdToData[exports.clickedFIlter]);
    } //----Вешает обработчик закрытия полноэкранного изображения----//


    bigPictureCloseButton.addEventListener('click', function () {
      closeElement(bigPicture);
    }); //----Вешает обработчик показа скрытых комментов----//

    loadCommentButton.addEventListener('click', showHiddenComments); //----Вешает обработчик загрузки нового коммента----//

    uploadComment.addEventListener('click', function () {
      addComment(fakePushToServer);
      showCurrentCommentsCount();
    });

    const bigPicture$1 = document.querySelector('.big-picture');
    const picturesContainer = document.querySelector('.pictures');
    const filters = document.querySelector('.img-filters');
    const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture'); //----Удаляет все мини фото----//

    function clearPictures() {
      while (picturesContainer.querySelectorAll('.picture')[0]) {
        picturesContainer.querySelectorAll('.picture')[0].remove();
      }
    } //----Создает дом элемент с заданными даннами из data----//

    function makePictureElement(data) {
      let newElement = pictureTemplate.cloneNode(true);
      newElement.querySelector('.picture__img').src = data.url;
      newElement.querySelector('.picture__likes').textContent = data.likes;
      newElement.querySelector('.picture__comments').textContent = data.comments.length;
      newElement.addEventListener('click', function (evt) {
        openElement(bigPicture$1);
        document.body.classList.add('modal-open');
        bigPictureClickHandler(evt, data);
      });
      return newElement;
    }

    function renderPictureElements(data) {
      let fragment = document.createDocumentFragment();

      for (let item of data) {
        fragment.appendChild(makePictureElement(item));
      }

      picturesContainer.appendChild(fragment);
      filters.classList.remove('img-filters--inactive');
    }

    const uploadSection$1 = document.querySelector('.img-upload');
    const hashTag$1 = uploadSection$1.querySelector('.text__hashtags');
    const textArea = uploadSection$1.querySelector('.text__description');
    const submitButton = uploadSection$1.querySelector('.img-upload__submit');

    function hashTagValidateHandler(element) {
      let regExp = /(#[^#\s]{1,19})/g;
      let str = element.value;
      let arr = str.match(regExp);

      let isTrue = (regExp, str) => regExp.test(str);

      if (isTrue(/(?<!\w)#(?!\w)/, str)) {
        element.setCustomValidity('Хеш-тег не может состоять только из одной решётки');
        element.reportValidity();
        element.style.outline = '3px solid red';
      } else if (isTrue(/[^#\w\s]{1,}(?=.*)|((?<!#)(\b\w{1,19}\b ?){1,5})/, str)) {
        element.setCustomValidity('Хеш-тег начинается c решетшки');
        element.reportValidity();
        element.style.outline = '3px solid red';
      } else if (isTrue(/(#\w{1,19}#\w*){1,5}/, str)) {
        element.setCustomValidity('Хэш-теги разделяются пробелами');
        element.reportValidity();
        element.style.outline = '3px solid red';
      } else if (isTrue(/((?<=\s)#(?!\w))/, str)) {
        console.log('ssd');
        element.setCustomValidity('Хеш-тег не может состоять только из одной решётки;');
        element.reportValidity();
        element.style.outline = '3px solid red';
      } else if (isTrue(/(#[^#\s]{1,19} ?){6,}/, str)) {
        element.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
        element.reportValidity();
        element.style.outline = '3px solid red';
      } else if (isTrue(/(#[^#\s]{20,} ?)/, str)) {
        element.setCustomValidity('Максимальная длина одного хэш-тега может быть 20 символов, включая решётку');
        element.reportValidity();
        element.style.outline = '3px solid red';
      } else {
        element.setCustomValidity('');
        element.reportValidity();
        element.style.outline = '';
      }

      if (arr) {
        let result = arr.toString().toLowerCase().split(',');

        for (let item of result) {
          let similiar = 0;

          for (let i = 0; i < result.length; i++) {
            if (item === result[i]) {
              similiar++;
            }
          }

          if (similiar > 1) {
            element.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
            element.reportValidity();
            element.style.outline = '3px solid red';
          }
        }
      }
    }

    function textAreaValidateHandler(element) {
      if (element.validity.tooLong) {
        element.setCustomValidity('длина комментария не может составлять больше 140 символов');
        element.style.outline = '3px solid red';
      } else {
        element.setCustomValidity('');
        element.style.outline = '';
      }
    }
    submitButton.addEventListener('click', function () {
      hashTagValidateHandler(hashTag$1);
      textAreaValidateHandler(textArea);
    });
    hashTag$1.addEventListener('keydown', function (evt) {
      evt.stopPropagation();
    });
    textArea.addEventListener('keydown', function (evt) {
      evt.stopPropagation();
    });

    debugger;
    const defaultFilter = document.querySelector('#filter-default');
    const filterRandom = document.querySelector('#filter-random');
    const filterDisscussed = document.querySelector('#filter-discussed');
    const picturesContainer$1 = document.querySelector('.pictures');
    const picture = picturesContainer$1.querySelectorAll('.pictures');
    const filterButtons = document.querySelectorAll('.img-filters__button'); //----Перемная текущего фильтра изображений др пользавателей, экспорт в filters----//

    exports.clickedFIlter = 'filter-default'; //----Обработчики фильтров изображений др пользавателей----//

    filterDisscussed.addEventListener('click', function (e) {
      exports.clickedFIlter = e.target.id;
      clearPictures();
      classToggler(filterButtons, filterDisscussed);
      renderPictureElements(sortByPopularity(data));
    });
    defaultFilter.addEventListener('click', function (e) {
      exports.clickedFIlter = e.target.id;
      clearPictures();
      classToggler(filterButtons, defaultFilter);
      renderPictureElements(data);
    });
    filterRandom.addEventListener('click', function (e) {
      exports.clickedFIlter = e.target.id;
      clearPictures();
      classToggler(filterButtons, filterRandom);
      renderPictureElements(sortByRandom(data));
    }); //renderPictureElements(data); Если не работает сервер

    ajaxGetRequest(renderPictureElements);

    return exports;

}({}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vanMvdXRpbHMuanMiLCIuLi9qcy9iYWNrZW5kLmpzIiwiLi4vanMvcGljdHVyZS1lZmZlY3RzLmpzIiwiLi4vanMvZmlsdGVycy5qcyIsIi4uL2pzL2JpZ3BpY3R1cmUuanMiLCIuLi9qcy9waWN0dXJlcy5qcyIsIi4uL2pzL2Zvcm0tdmFsaWRhdGlvbi5qcyIsIi4uL2pzL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7cmVzZXRUb0RlZmF1bHQsIGZvcm0sIGRlbGV0ZUJsb2JJbWFnZX0gZnJvbSAnLi9waWN0dXJlLWVmZmVjdHMuanMnXG5pbXBvcnQge2RhdGF9IGZyb20gJy4vZGF0YS5qcydcblxuY29uc3QgZW50ZXJFdmVudENvZGUgPSAnRW50ZXInO1xuY29uc3QgZXNjRXZlbnRDb2RlID0gJ0VzY2FwZSc7XG5sZXQgZWxlbWVudFRvQ2xvc2U7XG5cbmNvbnN0IGlzRXNjUHJlc3NlZCA9IGV2dCA9PiBldnQuY29kZSA9PT0gZXNjRXZlbnRDb2RlO1xuY29uc3QgaXNFbnRlclByZXNzZWQgPSBldnQgPT4gZXZ0LmNvZGUgPT09IGVudGVyRXZlbnRDb2RlO1xubGV0IGNoZWNrID0gKGVsZW0pID0+IGNvbnNvbGUubG9nKGVsZW0pO1xuXG5cbmZ1bmN0aW9uIGdldFJhbmRvbUludChtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbWF4KTtcbn1cblxuXG5jb25zdCBlc2NQcmVzc0hhbmRsZXIgPSAoZXZ0KSA9PiB7XG4gICAgaWYgKGlzRXNjUHJlc3NlZChldnQpKSB7XG4gICAgICAgIGNsb3NlRWxlbWVudChlbGVtZW50VG9DbG9zZSk7XG4gICAgICAgIGRlbGV0ZUJsb2JJbWFnZSgpO1xuICAgIH1cbn07XG5cbmNvbnN0IG9wZW5FbGVtZW50ID0gKGVsZW1lbnQpID0+IHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIGVsZW1lbnRUb0Nsb3NlID0gZWxlbWVudDtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXNjUHJlc3NIYW5kbGVyKTtcbn07XG5cbmNvbnN0IGNsb3NlRWxlbWVudCA9IChlbGVtZW50KSA9PiB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZXNjUHJlc3NIYW5kbGVyKTtcbiAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGFsLW9wZW4nKVxuICAgIHJlc2V0VG9EZWZhdWx0KClcbiAgICBmb3JtLnJlc2V0KCk7XG59O1xuXG4gZnVuY3Rpb24gY2xhc3NUb2dnbGVyKGFyclRvY2xlYXIsIGVsZW1lbnQpIHtcbiAgICBhcnJUb2NsZWFyLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ltZy1maWx0ZXJzX19idXR0b24tLWFjdGl2ZScpKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ltZy1maWx0ZXJzX19idXR0b24tLWFjdGl2ZScpO1xufVxuXG5cbmV4cG9ydCB7Y2xhc3NUb2dnbGVyLFxuICAgIG9wZW5FbGVtZW50LFxuICAgIGNsb3NlRWxlbWVudCxcbiAgICBjaGVjayxcbiAgICBlc2NQcmVzc0hhbmRsZXIsXG4gICAgaXNFc2NQcmVzc2VkLFxuICAgIGlzRW50ZXJQcmVzc2VkLFxuICAgIGdldFJhbmRvbUludFxufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzLmpzJztcbmltcG9ydCB7cmVzZXRUb0RlZmF1bHR9IGZyb20gJy4vcGljdHVyZS1lZmZlY3RzLmpzJ1xuXG5jb25zdCB4aHJTdGF0dXMgPSB7XG4gICAgT0s6IDIwMCxcbn07XG5leHBvcnQgbGV0IGRhdGE7XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4R2V0UmVxdWVzdChvblN1Y2Nlc3NDYiwgb25FcnJvciA9IGVycm9ySGFuZGxlcikge1xuXG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdqc29uJztcbiAgICBjb25zdCB1cmwgPSAnaHR0cHM6Ly9qYXZhc2NyaXB0LnBhZ2VzLmFjYWRlbXkva2Vrc3RhZ3JhbS9kYXRhJztcblxuICAgIHhoci5yZXNwb25zZVR5cGUgPSAnanNvbic7XG5cbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0geGhyU3RhdHVzLk9LKSB7XG4gICAgICAgICAgICBvblN1Y2Nlc3NDYih4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgZGF0YSA9IHhoci5yZXNwb25zZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9uRXJyb3IoYNCX0LDQv9GA0L7RgSDQvdC1INGD0LTQsNC70YHRjzogJHt4aHIuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIG9uRXJyb3IoJ9Ce0YjQuNCx0LrQsCDRgdC+0LXQtNC40L3QtdC90LjRjycpO1xuICAgIH0pO1xuXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWVvdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgb25FcnJvcihg0KHQtdGA0LLQtdGAINC90LUg0L7RgtCy0LXQsNC10YIg0LIg0YLQtdGH0LXQvdC40LUgJHt4aHIudGltZW91dH0g0LzRgWApO1xuICAgIH0pO1xuXG4gICAgeGhyLnRpbWVvdXQgPSAxMDAwMDtcbiAgICB4aHIub3BlbignR0VUJywgdXJsKTtcbiAgICB4aHIuc2VuZCgpO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4UG9zdFJlcXVlc3QoZGF0YSwgb25TdWNjZXNzLCBvbkVycm9yID0gZXJyb3JIYW5kbGVyKSB7XG4gICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vamF2YXNjcmlwdC5wYWdlcy5hY2FkZW15L2tla3N0YWdyYW0nO1xuXG4gICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IHhoclN0YXR1cy5PSykge1xuICAgICAgICAgICAgb25TdWNjZXNzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvbkVycm9yKGDQl9Cw0L/RgNC+0YEg0L3QtSDRg9C00LDQu9GB0Y86ICR7eGhyLnN0YXR1c1RleHR9YCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHhoci5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGVycm9ySGFuZGxlcign0J7RiNC40LHQutCwINGB0L7QtdC00LjQvdC10L3QuNGPJyk7XG4gICAgfSk7XG5cbiAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcigndGltZW91dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICBvbkVycm9yKGDQodC10YDQstC10YAg0L3QtSDQvtGC0LLQtdCw0LXRgiDQsiDRgtC10YfQtdC90LjQtSAke3hoci50aW1lb3V0fSDQvNGBYCk7XG4gICAgfSk7XG5cbiAgICB4aHIudGltZW91dCA9IDEwMDAwO1xuICAgIHhoci5vcGVuKCdQT1NUJywgdXJsKTtcbiAgICB4aHIuc2VuZChkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN1Y2Nlc3NIYW5kbGVyKG1lc3NhZ2UpIHtcbiAgICBsZXQgbmV3RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdWNjZXNzJykuXG4gICAgICAgIGNvbnRlbnQuXG4gICAgICAgIHF1ZXJ5U2VsZWN0b3IoJy5zdWNjZXNzJykuXG4gICAgICAgIGNsb25lTm9kZSh0cnVlKTtcbiAgICBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWNjZXNzX190aXRsZScpLnRleHRDb250ZW50ID0gbWVzc2FnZTtcbiAgICBuZXdFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdWNjZXNzX19idXR0b24nKS5cbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5ld0VsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICh1dGlscy5pc0VzY1ByZXNzZWQoZSkpIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnN1Y2Nlc3NfX2J1dHRvbicpLlxuICAgICAgICAgICAgY2xpY2soKTtcblxuICAgIH0sIHtvbmNlOiB0cnVlfSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQobmV3RWxlbWVudCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlcnJvckhhbmRsZXIobWVzc2FnZSkge1xuICAgIGxldCBuZXdFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2Vycm9yJykuXG4gICAgICAgIGNvbnRlbnQuXG4gICAgICAgIHF1ZXJ5U2VsZWN0b3IoJy5lcnJvcicpLlxuICAgICAgICBjbG9uZU5vZGUodHJ1ZSk7XG4gICAgbmV3RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZXJyb3JfX3RpdGxlJykudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLmVycm9yX19idXR0b24nKS5cbiAgICAgICAgYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5ld0VsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICByZXNldFRvRGVmYXVsdCgpXG4gICAgICAgIH0pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICh1dGlscy5pc0VzY1ByZXNzZWQoZSkpIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLmVycm9yX19idXR0b24nKS5cbiAgICAgICAgICAgIGNsaWNrKCk7XG4gICAgICAgIHJlc2V0VG9EZWZhdWx0KClcbiAgICB9LCB7b25jZTogdHJ1ZX0pO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kKG5ld0VsZW1lbnQpO1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7YWpheFBvc3RSZXF1ZXN0fSBmcm9tICcuL2JhY2tlbmQuanMnO1xuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscy5qcyc7XG5cbi8vLS0tLdCU0L7QvCDRjdC70LXQvNC10L3RgtGLLS0tLS8vXG5jb25zdCB1cGxvYWRTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmltZy11cGxvYWQnKTtcbmNvbnN0IHVwbG9hZEJ1dHRvbiA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignI3VwbG9hZC1maWxlJyk7XG5leHBvcnQgY29uc3QgZm9ybSA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignZm9ybScpO1xuY29uc3QgZWRpdEZvcm0gPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5pbWctdXBsb2FkX19vdmVybGF5Jyk7XG5leHBvcnQgY29uc3QgaW1hZ2VJbnB1dCA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLmltZy11cGxvYWRfX2lucHV0Jyk7XG5jb25zdCBlZGl0Rm9ybUNsb3NlQnV0dG9uID0gdXBsb2FkU2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcuaW1nLXVwbG9hZF9fY2FuY2VsJyk7XG5jb25zdCBwcmV2aWV3UGhvdG8gPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5pbWctdXBsb2FkX19wcmV2aWV3Jyk7XG5jb25zdCBwcmV2aWV3UGhvdG9JbWcgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5pbWctdXBsb2FkX19wcmV2aWV3IGltZycpO1xuY29uc3Qgc2NhbGVDb250cm9sTWludXMgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoXG4gICAgJy5zY2FsZV9fY29udHJvbC0tc21hbGxlcicpO1xuY29uc3Qgc2NhbGVDb250cm9sUGx1cyA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLnNjYWxlX19jb250cm9sLS1iaWdnZXInKTtcbmNvbnN0IHNjYWxlQ29udHJvbElucHV0ID0gdXBsb2FkU2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2NhbGVfX2NvbnRyb2wtLXZhbHVlJyk7XG5jb25zdCBlZmZlY3RQcmV2aWV3SW1nID0gdXBsb2FkU2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuZWZmZWN0c19fcHJldmlldycpO1xuY29uc3QgZWZmZWN0RWxlbWVudCA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLmVmZmVjdC1sZXZlbCcpO1xuY29uc3QgZWZmZWN0VmFsdWUgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5lZmZlY3QtbGV2ZWxfX3ZhbHVlJyk7XG5jb25zdCBlZmZlY3RzQmxvY2sgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5lZmZlY3RzX19saXN0Jyk7XG5jb25zdCBjaGVja2VkUmFkaW8gPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W2NoZWNrZWRdJyk7XG5jb25zdCBlZmZlY3REZXB0aCA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLmVmZmVjdC1sZXZlbF9fZGVwdGgnKTtcbmNvbnN0IHBpbkxldmVsTGluZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZmZlY3QtbGV2ZWxfX2xpbmUnKTtcbmNvbnN0IHBpbiA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLmVmZmVjdC1sZXZlbF9fcGluJyk7XG5jb25zdCBoYXNoVGFnID0gdXBsb2FkU2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcudGV4dF9faGFzaHRhZ3MnKTtcblxuY29uc3QgZWZmZWN0VmFsdWVUb0NsYXNzTmFtZSA9IHtcbiAgICBjaHJvbWU6IGBlZmZlY3RzX19wcmV2aWV3LS1jaHJvbWVgLFxuICAgIHNlcGlhOiBgZWZmZWN0c19fcHJldmlldy0tc2VwaWFgLFxuICAgIG1hcnZpbjogYGVmZmVjdHNfX3ByZXZpZXctLW1hcnZpbmAsXG4gICAgcGhvYm9zOiBgZWZmZWN0c19fcHJldmlldy0tcGhvYm9zYCxcbiAgICBoZWF0OiBgZWZmZWN0c19fcHJldmlldy0taGVhdGAsXG59O1xuXG5jb25zdCBlZmZlY3RWYWx1ZVRvRmlsdGVyTmFtZSA9IHtcbiAgICBjaHJvbWU6IGBncmF5c2NhbGVgLFxuICAgIHNlcGlhOiBgc2VwaWFgLFxuICAgIG1hcnZpbjogYGludmVydGAsXG4gICAgcGhvYm9zOiBgYmx1cmAsXG4gICAgaGVhdDogYGJyaWdodG5lc3NgLFxufTtcblxuY29uc3QgZWZmZWN0VmFsdWVUb2ZpbHRlckNhbGxiYWNrID0ge1xuICAgIGNocm9tZTogKGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBjc3NJbmRleCA9IGluZGV4IC8gcGluTGV2ZWxMaW5lLm9mZnNldFdpZHRoO1xuICAgICAgICBwcmV2aWV3UGhvdG8uc3R5bGUuZmlsdGVyID0gYCR7Y3VycmVudEZpbHRlcn0oJHtjc3NJbmRleH0pYDtcbiAgICB9LFxuICAgIHNlcGlhOiAoaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IGNzc0luZGV4ID0gaW5kZXggLyBwaW5MZXZlbExpbmUub2Zmc2V0V2lkdGg7XG4gICAgICAgIHByZXZpZXdQaG90by5zdHlsZS5maWx0ZXIgPSBgJHtjdXJyZW50RmlsdGVyfSgke2Nzc0luZGV4fSlgO1xuICAgIH0sXG4gICAgbWFydmluOiAoaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IGNzc0luZGV4ID0gaW5kZXggLyBwaW5MZXZlbExpbmUub2Zmc2V0V2lkdGggKiAxMDAgKyAnJSc7XG4gICAgICAgIHByZXZpZXdQaG90by5zdHlsZS5maWx0ZXIgPSBgJHtjdXJyZW50RmlsdGVyfSgke2Nzc0luZGV4fSlgO1xuICAgIH0sXG4gICAgcGhvYm9zOiAoaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IGNzc0luZGV4ID0gaW5kZXggKiAzIC8gcGluTGV2ZWxMaW5lLm9mZnNldFdpZHRoICsgJ3B4JztcbiAgICAgICAgcHJldmlld1Bob3RvLnN0eWxlLmZpbHRlciA9IGAke2N1cnJlbnRGaWx0ZXJ9KCR7Y3NzSW5kZXh9KWA7XG5cbiAgICB9LFxuICAgIGhlYXQ6IChpbmRleCkgPT4ge1xuICAgICAgICBsZXQgY3NzSW5kZXggPSAxICsgKDIgKiBpbmRleCAvIHBpbkxldmVsTGluZS5vZmZzZXRXaWR0aCk7XG4gICAgICAgIHByZXZpZXdQaG90by5zdHlsZS5maWx0ZXIgPSBgJHtjdXJyZW50RmlsdGVyfSgke2Nzc0luZGV4fSlgO1xuICAgIH0sXG5cbn07XG5cbmNvbnN0IHRyYW5zZm9ybVRvQ2FsbGJhY2sgPSB7XG4gICAgc2NhbGU6IChpbmRleCkgPT4ge1xuICAgICAgICBsZXQgY3NzSW5kZXggPSBwYXJzZUludChpbmRleCkgLyAxMDA7XG4gICAgICAgIHByZXZpZXdQaG90by5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtjc3NJbmRleH0pYDtcbiAgICB9LFxufTtcblxuLy8tLS0t0J/QtdGA0LXQvNC10L3QvdGL0LUg0LTQu9GPINC+0LHRgNCw0LHQvtGC0YfQuNC60L7QsiDRgdC+0LHRi9GC0LjQuS0tLS0vL1xubGV0IGNsaWNrZWRDbGFzcztcbmxldCBjbGlja2VkTm9kZTtcbmxldCBjdXJyZW50RmlsdGVyO1xubGV0IGZpbHRlckNhbGxiYWNrO1xuXG4vLy0tLS3QodCx0YDQvtGBINC30L3QsNGH0LXQvdC40Lkg0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4tLS0tLy9cbmZ1bmN0aW9uIHJlc2V0VG9EZWZhdWx0KCkge1xuICAgIGlmIChjbGlja2VkQ2xhc3MpIHByZXZpZXdQaG90by5jbGFzc0xpc3QucmVtb3ZlKGNsaWNrZWRDbGFzcyk7XG4gICAgaWYgKGNsaWNrZWROb2RlICYmIGNsaWNrZWROb2RlLnZhbHVlICE9PSAnbm9uZScpIHtcbiAgICAgICAgZWZmZWN0RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICAgICAgZWZmZWN0VmFsdWUudmFsdWUgPSAxMDA7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWZmZWN0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgZWZmZWN0VmFsdWUudmFsdWUgPSAwO1xuICAgIH1cbiAgICBwaW4uc3R5bGUubGVmdCA9ICcxMDAlJztcbiAgICBlZmZlY3REZXB0aC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICBwcmV2aWV3UGhvdG8uc3R5bGUuZmlsdGVyID0gJyc7XG4gICAgcHJldmlld1Bob3RvLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgxKSc7XG4gICAgc2NhbGVDb250cm9sSW5wdXQudmFsdWUgPSAnMTAwJSc7XG4gICAgaGFzaFRhZy5zdHlsZS5vdXRsaW5lID0gJyc7XG59O1xuXG4vLy0tLS3QntCx0YDQsNCx0L7RgtGH0LjQuiDQvdCw0LbQsNGC0LjRjyDQvdCwICstLS0tLy9cbmZ1bmN0aW9uIHNjYWxlTWludXNDbGlja0hhbmRsZXIoY2FsbGJhY2spIHtcbiAgICBsZXQgc2NhbGVTdGVwID0gMjU7XG4gICAgbGV0IHNjYWxlVmFsdWUgPSBwYXJzZUludChzY2FsZUNvbnRyb2xJbnB1dC52YWx1ZSk7XG4gICAgaWYgKHNjYWxlVmFsdWUgPiBzY2FsZVN0ZXApIHNjYWxlQ29udHJvbElucHV0LnZhbHVlID0gKHNjYWxlVmFsdWUgLVxuICAgICAgICBzY2FsZVN0ZXApICsgJyUnO1xuICAgIGNhbGxiYWNrKHNjYWxlQ29udHJvbElucHV0LnZhbHVlKTtcblxufTtcblxuLy8tLS0t0J7QsdGA0LDQsdC+0YLRh9C40Log0L3QsNC20LDRgtC40Y8g0L3QsCAtIC0tLS0vL1xuZnVuY3Rpb24gc2NhbGVQbHVzQ2xpY2tIYW5kbGVyKGNhbGxiYWNrKSB7XG4gICAgbGV0IHNjYWxlU3RlcCA9IDI1O1xuICAgIGxldCBtYXhTY2FsZSA9IDEwMDtcbiAgICBsZXQgc2NhbGVWYWx1ZSA9IHBhcnNlSW50KHNjYWxlQ29udHJvbElucHV0LnZhbHVlKTtcbiAgICBpZiAoc2NhbGVWYWx1ZSA8IG1heFNjYWxlKSBzY2FsZUNvbnRyb2xJbnB1dC52YWx1ZSA9IChzY2FsZVZhbHVlICtcbiAgICAgICAgc2NhbGVTdGVwKSArICclJztcbiAgICBjYWxsYmFjayhzY2FsZUNvbnRyb2xJbnB1dC52YWx1ZSk7XG5cbn07XG5cbi8vLS0tLdCe0LHRgNCw0LHQvtGC0YfQuNC6INGB0LzQtdC90Ysg0YTQuNC70YzRgtGA0LAtLS0tLy9cbmZ1bmN0aW9uIGVmZmVjdENoYW5nZUhhbmRsZXIoZXZ0KSB7XG4gICAgY2xpY2tlZE5vZGUgPSBldnQudGFyZ2V0O1xuICAgIHJlc2V0VG9EZWZhdWx0KCk7XG4gICAgY3VycmVudEZpbHRlciA9IGVmZmVjdFZhbHVlVG9GaWx0ZXJOYW1lW2V2dC50YXJnZXQudmFsdWVdO1xuICAgIGZpbHRlckNhbGxiYWNrID0gZWZmZWN0VmFsdWVUb2ZpbHRlckNhbGxiYWNrW2V2dC50YXJnZXQudmFsdWVdO1xuICAgIGNsaWNrZWRDbGFzcyA9IGVmZmVjdFZhbHVlVG9DbGFzc05hbWVbZXZ0LnRhcmdldC52YWx1ZV07XG4gICAgaWYgKGNsaWNrZWRDbGFzcykgcHJldmlld1Bob3RvLmNsYXNzTGlzdC5hZGQoY2xpY2tlZENsYXNzKTtcbn07XG5cbi8vLS0tLdCe0LHRgNCw0LHQvtGC0YfQuNC6INCU0YDQsNCzINCw0L3QtCDQlNGA0L7QvyDQvdCwINC/0L7Qu9C30YPQvdC60LUg0YHQvNC10L3RiyDRg9GA0L7QstC90Y8g0Y3RhNGE0LXQutGC0LAtLS0tLy9cbmZ1bmN0aW9uIHBpbk1vdXNlRG93bkhhbmRsZXIgKGV2ZW50LCBjYWxsYmFjaykge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgbGV0IHNoaWZ0WCA9IGV2ZW50LmNsaWVudFggLSBwaW4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcblxuICAgIGZ1bmN0aW9uIG1vdXNlTW92ZUhhbmRsZXIgKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBuZXdMZWZ0ID0gZXZlbnQuY2xpZW50WCAtIHNoaWZ0WCAtXG4gICAgICAgICAgICBwaW5MZXZlbExpbmUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcblxuICAgICAgICBpZiAobmV3TGVmdCA8IDApIHtcbiAgICAgICAgICAgIG5ld0xlZnQgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJpZ2h0RWRnZSA9IHBpbkxldmVsTGluZS5vZmZzZXRXaWR0aDtcbiAgICAgICAgaWYgKG5ld0xlZnQgPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICAgIG5ld0xlZnQgPSByaWdodEVkZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBwaW4uc3R5bGUubGVmdCA9IG5ld0xlZnQgKyAncHgnO1xuICAgICAgICBlZmZlY3REZXB0aC5zdHlsZS53aWR0aCA9IG5ld0xlZnQgKyAncHgnO1xuICAgICAgICBsZXQgaW5wdXRWYWx1ZU9mRWZMZXZlbCA9IG5ld0xlZnQgLyBwaW5MZXZlbExpbmUub2Zmc2V0V2lkdGggKiAxMDA7XG4gICAgICAgIGVmZmVjdFZhbHVlLnZhbHVlID0gTWF0aC5yb3VuZChpbnB1dFZhbHVlT2ZFZkxldmVsKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjayhuZXdMZWZ0KTtcblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBtb3VzZVVwSGFuZGxlciAoKSB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2VVcEhhbmRsZXIpO1xuXG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlTW92ZUhhbmRsZXIpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZVVwSGFuZGxlcik7XG5cbiAgICBwaW4ub25kcmFnc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbn07XG5cbi8vLS0tLdCf0L7QutCw0LfQsNC30YLRjCDQt9Cw0LPRgNGD0LbQtdC90L3Rg9GOINGE0L7RgtC60YMg0L3QsCDRjdC60YDQsNC90LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDRhNC+0YLQviDQuCDQstCw0YDQuNCw0L3RgtCw0YUg0YTQuNC70YzRgtGA0LAtLS0tLy9cbmZ1bmN0aW9uIHNob3dCbG9iSW1nICgpIHtcbiAgICBjb25zdCBibG9iSW1hZ2UgPSBpbWFnZUlucHV0LmZpbGVzWzBdO1xuICAgIHByZXZpZXdQaG90b0ltZy5zcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2JJbWFnZSk7XG4gICAgZm9yIChsZXQgaXRlbSBvZiBlZmZlY3RQcmV2aWV3SW1nKSB7XG4gICAgICAgIGl0ZW0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHtVUkwuY3JlYXRlT2JqZWN0VVJMKFxuICAgICAgICAgICAgYmxvYkltYWdlKX0nKWA7XG4gICAgfVxuXG59O1xuXG4vLy0tLS3Qo9C00LDQu9C40YLRjCDQt9Cw0LPRgNGD0LbQtdC90L3Rg9GOINGE0L7RgtC60YMg0L3QsCDRjdC60YDQsNC90LUg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjyDRhNC+0YLQviDQuCDQstCw0YDQuNCw0L3RgtCw0YUg0YTQuNC70YzRgtGA0LAtLS0tLy9cbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVCbG9iSW1hZ2UgKCkge1xuICAgIGNvbnN0IGJsb2JJbWFnZSA9IGltYWdlSW5wdXQuZmlsZXNbMF07XG4gICAgZm9yIChsZXQgaXRlbSBvZiBlZmZlY3RQcmV2aWV3SW1nKSB7XG4gICAgICAgIGl0ZW0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgnJHtVUkwucmV2b2tlT2JqZWN0VVJMKFxuICAgICAgICAgICAgYmxvYkltYWdlKX0nKWA7XG4gICAgfVxufTtcblxuLy8tLS0t0J3QsNCy0LXRiNC40LLQsNC10Lwg0L7QsdGA0LDQsdC+0YLRh9C40LrQuCDQstGL0LHQvtGA0LAg0YTQuNC70YzRgtCwLCDQs9C70YPQsdC40L3RiyDRjdGE0YTQtdC60YLQsCwg0L7RgtC60YDRi9GC0LjRjyDQuCDQt9Cw0LrRgNGL0YLQuNGPINGE0L7RgNC80Ysg0YDQtdC00LDQutGC0LjRgNC+0LLQsNC90LjRjy0tLS0vL1xuc2NhbGVDb250cm9sUGx1cy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIHNjYWxlUGx1c0NsaWNrSGFuZGxlcih0cmFuc2Zvcm1Ub0NhbGxiYWNrLnNjYWxlKTtcbn0pO1xuc2NhbGVDb250cm9sTWludXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICA7XG4gICAgc2NhbGVNaW51c0NsaWNrSGFuZGxlcih0cmFuc2Zvcm1Ub0NhbGxiYWNrLnNjYWxlKTtcblxufSk7XG5lZmZlY3RzQmxvY2suYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZWZmZWN0Q2hhbmdlSGFuZGxlcik7XG5cbnVwbG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICB1dGlscy5vcGVuRWxlbWVudChlZGl0Rm9ybSk7XG4gICAgc2hvd0Jsb2JJbWcoKTtcbn0pO1xuZWRpdEZvcm1DbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgIHV0aWxzLmNsb3NlRWxlbWVudChlZGl0Rm9ybSk7XG4gICAgZGVsZXRlQmxvYkltYWdlKCk7XG5cbn0pO1xuXG5waW4uYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBwaW5Nb3VzZURvd25IYW5kbGVyKGV2ZW50LCBmaWx0ZXJDYWxsYmFjayk7XG5cbn0pO1xuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGFqYXhQb3N0UmVxdWVzdChuZXcgRm9ybURhdGEoZm9ybSksIGZ1bmN0aW9uKCkge1xuICAgICAgICB1dGlscy5jbG9zZUVsZW1lbnQoZWRpdEZvcm0pO1xuICAgIH0pO1xufSk7XG5cbi8vLS0tLdCX0L3QsNGH0LXQvdC40Y8g0L/QviDRg9C80L7Qu9GH0LDQvdC40Y4tLS0tLy9cbmVmZmVjdFZhbHVlLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAwKTtcbnNjYWxlQ29udHJvbElucHV0LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnMTAwJyk7XG51dGlscy5jbG9zZUVsZW1lbnQoZWZmZWN0RWxlbWVudCk7XG5cbmV4cG9ydCB7cmVzZXRUb0RlZmF1bHR9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuaW1wb3J0IHtnZXRSYW5kb21JbnR9IGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtkYXRhfSBmcm9tICcuL2JhY2tlbmQuanMnXG4vLyBpbXBvcnQge2RhdGF9IGZyb20gJy4vZGF0YS5qcyc7XG5cbnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgZmlsdGVySWRUb0RhdGFbJ2ZpbHRlci1kZWZhdWx0J10gPSBkYXRhO1xufSwgNTAwKVxuXG5cblxuZXhwb3J0IGNvbnN0IGZpbHRlcklkVG9EYXRhID0ge1xuICAgIC8vICdmaWx0ZXItZGlzY3Vzc2VkJzogcmV0dXJuRGF0YW9mRm4sXG4gICAgLy8gJ2ZpbHRlci1yYW5kb20nOiByZXR1cm5EYXRhb2ZGbixcbiAgICAnZmlsdGVyLWRlZmF1bHQnOiBkYXRhLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNvcnRCeVBvcHVsYXJpdHkoZGF0YSkge1xuICAgIGxldCBkYXRhQ29weSA9IGRhdGEuc2xpY2UoKTtcbiAgICBsZXQgbmV3QXJyID0gZGF0YUNvcHkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICByZXR1cm4gYi5jb21tZW50cy5sZW5ndGggLSBhLmNvbW1lbnRzLmxlbmd0aDtcbiAgICB9KTtcbiAgICBmaWx0ZXJJZFRvRGF0YVsnZmlsdGVyLWRpc2N1c3NlZCddID0gbmV3QXJyO1xuICAgIHJldHVybiBuZXdBcnI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzb3J0QnlSYW5kb20oZGF0YSkge1xuICAgIGxldCByYW5kb21OdW1iZXJzID0gW107XG4gICAgd2hpbGUgKHJhbmRvbU51bWJlcnMubGVuZ3RoIDwgMTApIHtcbiAgICAgICAgbGV0IHJhbmRvbSA9IGdldFJhbmRvbUludCgyNSk7XG4gICAgICAgIGlmICghcmFuZG9tTnVtYmVycy5zb21lKGl0ZW0gPT4gaXRlbSA9PT0gcmFuZG9tKSkge1xuICAgICAgICAgICAgcmFuZG9tTnVtYmVycy5wdXNoKHJhbmRvbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGV0IHJhbmRvbUFycmF5ID0gcmFuZG9tTnVtYmVycy5tYXAoaXRlbSA9PiB7XG4gICAgICAgIHJldHVybiBkYXRhW2l0ZW1dO1xuICAgIH0pO1xuICAgIGZpbHRlcklkVG9EYXRhWydmaWx0ZXItcmFuZG9tJ10gPSByYW5kb21BcnJheTtcbiAgICByZXR1cm4gcmFuZG9tQXJyYXk7XG59XG5cbiIsImltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuXG5pbXBvcnQge2RhdGF9IGZyb20gJy4vYmFja2VuZC5qcydcbi8vIGltcG9ydCB7ZGF0YX0gZnJvbSAnLi9kYXRhLmpzJztcbmltcG9ydCB7cmVuZGVyUGljdHVyZUVsZW1lbnRzLCBjbGVhclBpY3R1cmVzfSBmcm9tICcuL3BpY3R1cmVzLmpzJztcbmltcG9ydCB7Y2xpY2tlZEZJbHRlcn0gZnJvbSAnLi9tYWluLmpzJztcbmltcG9ydCAqIGFzIGZpbHRlcnMgZnJvbSAnLi9maWx0ZXJzLmpzJztcblxuLy8tLS0t0JTQvtC8INGN0LvQtdC80LXQvdGC0YstLS0tLy9cbmNvbnN0IHVwbG9hZFNvY2lhbEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50cy1sb2FkZXInKTtcbmNvbnN0IGJpZ1BpY3R1cmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmlnLXBpY3R1cmUnKTtcbmNvbnN0IGJpZ1BpY3R1cmVJbWcgPSBiaWdQaWN0dXJlLnF1ZXJ5U2VsZWN0b3IoJy5iaWctcGljdHVyZV9faW1nIGltZycpO1xuY29uc3QgYmlnUGljdHVyZUNsb3NlQnV0dG9uID0gYmlnUGljdHVyZS5xdWVyeVNlbGVjdG9yKCcuYmlnLXBpY3R1cmVfX2NhbmNlbCcpO1xuY29uc3QgbGlrZXNDb3VudCA9IGJpZ1BpY3R1cmUucXVlcnlTZWxlY3RvcignLmxpa2VzLWNvdW50Jyk7XG5jb25zdCBwaG90b0Rpc2NyaXRpb24gPSBiaWdQaWN0dXJlLnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWxfX2NhcHRpb24nKTtcbmNvbnN0IHNvY2lhbENvbW1lbnRibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWxfX2NvbW1lbnRzJyk7XG5jb25zdCBjb21tZW50cyA9IHNvY2lhbENvbW1lbnRibG9jay5jaGlsZHJlbjtcbmNvbnN0IGJsb2NrT2Zjb21tZW50cyA9IGJpZ1BpY3R1cmUucXVlcnlTZWxlY3RvcignLnNvY2lhbF9fY29tbWVudC1jb3VudCcpO1xuY29uc3QgY29tbWVudHNDb3VudCA9IGJpZ1BpY3R1cmUucXVlcnlTZWxlY3RvcignLmNvbW1lbnRzLWNvdW50Jyk7XG5jb25zdCBjb21tZW50VGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zb2NpYWxfX3RleHQnKTtcbmNvbnN0IHNvY2lhbEF2YXRhciA9IGJpZ1BpY3R1cmUucXVlcnlTZWxlY3RvcignLnNvY2lhbF9fcGljdHVyZScpO1xuY29uc3QgbG9hZENvbW1lbnRCdXR0b24gPSBiaWdQaWN0dXJlLnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWxfX2NvbW1lbnRzLWxvYWRlcicpO1xuY29uc3QgY29tbWVudElucHV0ID0gYmlnUGljdHVyZS5xdWVyeVNlbGVjdG9yKCcuc29jaWFsX19mb290ZXItdGV4dCcpO1xuY29uc3QgdXBsb2FkQ29tbWVudCA9IGJpZ1BpY3R1cmUucXVlcnlTZWxlY3RvcignLnNvY2lhbF9fZm9vdGVyLWJ0bicpO1xuLy8gY29uc3QgcGljdHVyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5waWN0dXJlcycpLnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignLnBpY3R1cmVfX2NvbW1lbnRzJylcbmNvbnN0IGNvbW1lbnRUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb21tZW50JykuXG4gICAgY29udGVudC5cbiAgICBxdWVyeVNlbGVjdG9yKCcuc29jaWFsX19jb21tZW50Jyk7XG5cbi8vLS0tLdCf0LXRgNC10LzQtdC90L3Ri9C1LS0tLS8vXG5sZXQgY29tbWVudENvdW50O1xubGV0IGNsaWNrZWRJdGVtO1xuXG4vLy0tLS3QndCw0LLQtdGI0LjQstCw0LXRgiDQtNCw0L3QvdGL0LUg0L3QsCDQv9C+0LvQvdC+0Y3QutGA0LDQvdC90L7QtSDQuNC30L7QsdGA0LDQttC10L3QuNC1LS0tLS8vXG5leHBvcnQgZnVuY3Rpb24gYmlnUGljdHVyZUNsaWNrSGFuZGxlcihldnQsIGRhdGEpIHtcbiAgICBjbGlja2VkSXRlbSA9IGV2dC50YXJnZXQ7XG4gICAgY29tbWVudENvdW50ID0gZGF0YS5jb21tZW50cy5sZW5ndGg7XG4gICAgYXBwZW5kUGljdHVyZURhdGEoZGF0YSk7XG4gICAgZGVsZXRlTm9kZXMoY29tbWVudHMpO1xuICAgIHJlbmRlckNvbW1lbnRFbGVtZW50cyhkYXRhLCBzb2NpYWxDb21tZW50YmxvY2spO1xufVxuXG4vLy0tLS3QntCx0L3QvtCy0LvRj9C10YIg0LjQvdGE0L4g0L4g0LrQvtC7LdCy0LUg0LrQvtC80LzQtdC90YLQvtCyLS0tLS8vXG5mdW5jdGlvbiBzaG93Q3VycmVudENvbW1lbnRzQ291bnQoKSB7XG4gICAgaWYgKGNvbW1lbnRDb3VudCA+IDQpIGJsb2NrT2Zjb21tZW50cy50ZXh0Q29udGVudCA9IGA1INC40LcgJHtjb21tZW50Q291bnR9INC60L7QvNC80LXQvdGC0LDRgNC40LXQsmA7XG4gICAgZWxzZSBpZiAoY29tbWVudENvdW50ID09PSAxKSBibG9ja09mY29tbWVudHMudGV4dENvbnRlbnQgPSBgJHtjb21tZW50Q291bnR9INC60L7QvNC80LXQvdGC0LDRgNC40LlgO1xuICAgIGVsc2UgYmxvY2tPZmNvbW1lbnRzLnRleHRDb250ZW50ID0gYCR7Y29tbWVudENvdW50fSDQutC+0LzQvNC10L3RgtCw0YDQuNGPYDtcbn1cblxuLy8tLS0t0JTQvtCx0LDQstC70Y/QtdGCINC40L3RhNC+INC90LAg0L/QvtC70L3QvtGN0LrRgNCw0L3QvdC+0LUg0YTQvtGC0L4tLS0tLy9cbmZ1bmN0aW9uIGFwcGVuZFBpY3R1cmVEYXRhKGRhdGEpIHtcbiAgICBiaWdQaWN0dXJlSW1nLnNyYyA9IGRhdGEudXJsO1xuICAgIGxpa2VzQ291bnQudGV4dENvbnRlbnQgPSBkYXRhLmxpa2VzO1xuICAgIHBob3RvRGlzY3JpdGlvbi50ZXh0Q29udGVudCA9IGRhdGEuZGVzY3JpcHRpb247XG4gICAgc29jaWFsQXZhdGFyLnNyYyA9IGBpbWcvYXZhdGFyLSR7TWF0aC5jZWlsKE1hdGgucmFuZG9tKCkgKiA2KX0uc3ZnYDtcbiAgICBsb2FkQ29tbWVudEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICBzaG93Q3VycmVudENvbW1lbnRzQ291bnQoKTtcblxufVxuXG4vLy0tLS3Qo9C00LDQu9GP0LXRgiDRjdC70LvQtdC80LXQvdGC0YstLS0tLy9cbmZ1bmN0aW9uIGRlbGV0ZU5vZGVzKGVsZW1lbnRzKSB7XG4gICAgd2hpbGUgKGVsZW1lbnRzWzBdKSB7XG4gICAgICAgIGVsZW1lbnRzWzBdLnJlbW92ZSgpO1xuICAgIH1cbn1cbi8vLS0tLdCt0LvQtdC80LXQvdGCINC00LvRjyDQvdC+0LLQvtCz0L4g0LrQvtC80LzQtdC90YLQsC0tLS0vL1xuZnVuY3Rpb24gbWFrZUNvbW1lbnRFbGVtZW50KGRhdGEsIGluZGV4KSB7XG4gICAgbGV0IG5ld0VsZW1lbnQgPSBjb21tZW50VGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xuICAgIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnNvY2lhbF9fcGljdHVyZScpLnNyYyA9IGRhdGEuYXZhdGFyO1xuICAgIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnNvY2lhbF9fdGV4dCcpLnRleHRDb250ZW50ID0gZGF0YS5tZXNzYWdlO1xuICAgIGlmIChpbmRleCkgbmV3RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICByZXR1cm4gbmV3RWxlbWVudDtcbn1cblxuLy8tLS0t0KDQtdC90LTQtdGA0LjRgiDQvdCwINGB0YLRgNCw0L3QuNGG0YMg0LjQvNC10Y7RidC40LXRgdGPINC60L7QvNC80LXQvdGC0Ysg0LIg0LHQsNC30LUg0LTQsNC90L3Ri9GFLS0tLS8vXG5mdW5jdGlvbiByZW5kZXJDb21tZW50RWxlbWVudHMoZGF0YSwgY29udGFpbmVyKSB7XG4gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGRhdGEuY29tbWVudHMuZm9yRWFjaCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGluZGV4ID4gNCkge1xuICAgICAgICAgICAgZnJhZ21lbnQuYXBwZW5kQ2hpbGQobWFrZUNvbW1lbnRFbGVtZW50KGl0ZW0sIGluZGV4KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChtYWtlQ29tbWVudEVsZW1lbnQoaXRlbSkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgY29udGFpbmVyLmFwcGVuZChmcmFnbWVudCk7XG59XG5cbi8vLS0tLdCf0L7QutCw0LfRi9Cy0LDQtdGCINGB0LrRgNGL0YLRi9C1INC60L7QvNC80LXQvdGC0LDRgNC40LgtLS0tLy9cbmZ1bmN0aW9uIHNob3dIaWRkZW5Db21tZW50cygpIHtcbiAgICBmb3IgKGxldCBjb21tZW50IG9mIGNvbW1lbnRzKSB7XG4gICAgICAgIGNvbW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XG4gICAgfVxuICAgIGxvYWRDb21tZW50QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xufVxuXG4vLy0tLS3QlNC+0LHQsNCy0LvRj9C10YIg0L3QvtCy0YvQuSDQutC+0LzQvNC10L3Rgi0tLS0vL1xuZnVuY3Rpb24gYWRkQ29tbWVudChjYWxsYmFjaykge1xuICAgIGxldCBhdmF0YXIgPSBgaW1nL2F2YXRhci0ke01hdGguY2VpbChNYXRoLnJhbmRvbSgpICogNil9LnN2Z2A7XG4gICAgc29jaWFsQ29tbWVudGJsb2NrLmluc2VydEFkamFjZW50RWxlbWVudCgnYWZ0ZXJiZWdpbicsIG1ha2VDb21tZW50RWxlbWVudCh7XG4gICAgICAgIG1lc3NhZ2U6IGNvbW1lbnRJbnB1dC52YWx1ZSxcbiAgICAgICAgYXZhdGFyOiBhdmF0YXIsXG4gICAgfSkpO1xuICAgIGNvbW1lbnRDb3VudCArPSAxO1xuICAgIGNhbGxiYWNrKGF2YXRhciwgY29tbWVudElucHV0LnZhbHVlKTtcbiAgICBjb21tZW50SW5wdXQudmFsdWUgPSAnJztcbn1cblxuXG4vLy0tLS3QntCx0L3QvtCy0LvRj9C10YIg0LrQvtC70LjRh9C10YHRgtCy0L4g0LrQvtC80LzQtdC90YLQvtCyINC90LAg0LzQuNC90Lgg0YTQvtGC0LrQsNGFLS0tLS8vXG5mdW5jdGlvbiBmYWtlUHVzaFRvU2VydmVyKGF2YXRhciwgY29tbWVudCkge1xuICAgIGRhdGEuZmluZChpdGVtID0+IHtcbiAgICAgICAgcmV0dXJuIGNsaWNrZWRJdGVtLnNyYy5tYXRjaCgvXFxkK1xcLmpwZyQvKVswXSA9PT1cbiAgICAgICAgICAgIGl0ZW0udXJsLm1hdGNoKC9cXGQrXFwuanBnJC8pWzBdO1xuICAgIH0pLmNvbW1lbnRzLnVuc2hpZnQoe2F2YXRhcjogYXZhdGFyLCBtZXNzYWdlOiBjb21tZW50fSk7XG4gICAgY2xlYXJQaWN0dXJlcygpO1xuICAgIHJlbmRlclBpY3R1cmVFbGVtZW50cyhmaWx0ZXJzLmZpbHRlcklkVG9EYXRhW2NsaWNrZWRGSWx0ZXJdKTtcbn1cblxuLy8tLS0t0JLQtdGI0LDQtdGCINC+0LHRgNCw0LHQvtGC0YfQuNC6INC30LDQutGA0YvRgtC40Y8g0L/QvtC70L3QvtGN0LrRgNCw0L3QvdC+0LPQviDQuNC30L7QsdGA0LDQttC10L3QuNGPLS0tLS8vXG5iaWdQaWN0dXJlQ2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICB1dGlscy5jbG9zZUVsZW1lbnQoYmlnUGljdHVyZSk7XG59KTtcblxuLy8tLS0t0JLQtdGI0LDQtdGCINC+0LHRgNCw0LHQvtGC0YfQuNC6INC/0L7QutCw0LfQsCDRgdC60YDRi9GC0YvRhSDQutC+0LzQvNC10L3RgtC+0LItLS0tLy9cbmxvYWRDb21tZW50QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2hvd0hpZGRlbkNvbW1lbnRzKTtcblxuLy8tLS0t0JLQtdGI0LDQtdGCINC+0LHRgNCw0LHQvtGC0YfQuNC6INC30LDQs9GA0YPQt9C60Lgg0L3QvtCy0L7Qs9C+INC60L7QvNC80LXQvdGC0LAtLS0tLy9cbnVwbG9hZENvbW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICBhZGRDb21tZW50KGZha2VQdXNoVG9TZXJ2ZXIpO1xuICAgIHNob3dDdXJyZW50Q29tbWVudHNDb3VudCgpO1xuXG59KTtcblxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMuanMnO1xuaW1wb3J0IHtiaWdQaWN0dXJlQ2xpY2tIYW5kbGVyfSBmcm9tICcuL2JpZ3BpY3R1cmUuanMnO1xuXG4vLy0tLS3QlNC+0Lwg0Y3Qu9C10LzQtdC90YLRiy0tLS0vL1xuY29uc3QgYmlnUGljdHVyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5iaWctcGljdHVyZScpO1xuY29uc3QgcGljdHVyZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGljdHVyZXMnKTtcbmNvbnN0IGZpbHRlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaW1nLWZpbHRlcnMnKTtcbmNvbnN0IHBpY3R1cmVUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwaWN0dXJlJykuXG4gICAgY29udGVudC5cbiAgICBxdWVyeVNlbGVjdG9yKCcucGljdHVyZScpO1xuXG4vLy0tLS3Qo9C00LDQu9GP0LXRgiDQstGB0LUg0LzQuNC90Lgg0YTQvtGC0L4tLS0tLy9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhclBpY3R1cmVzICgpIHtcbiAgICB3aGlsZSAocGljdHVyZXNDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnBpY3R1cmUnKVswXSkge1xuICAgICAgICBwaWN0dXJlc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcucGljdHVyZScpWzBdLnJlbW92ZSgpO1xuICAgIH1cbn1cblxuLy8tLS0t0KHQvtC30LTQsNC10YIg0LTQvtC8INGN0LvQtdC80LXQvdGCINGBINC30LDQtNCw0L3QvdGL0LzQuCDQtNCw0L3QvdCw0LzQuCDQuNC3IGRhdGEtLS0tLy9cbmZ1bmN0aW9uIG1ha2VQaWN0dXJlRWxlbWVudChkYXRhKSB7XG4gICAgbGV0IG5ld0VsZW1lbnQgPSBwaWN0dXJlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xuICAgIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnBpY3R1cmVfX2ltZycpLnNyYyA9IGRhdGEudXJsO1xuICAgIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnBpY3R1cmVfX2xpa2VzJykudGV4dENvbnRlbnQgPSBkYXRhLmxpa2VzO1xuICAgIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgJy5waWN0dXJlX19jb21tZW50cycpLnRleHRDb250ZW50ID0gZGF0YS5jb21tZW50cy5sZW5ndGg7XG4gICAgbmV3RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICB1dGlscy5vcGVuRWxlbWVudChiaWdQaWN0dXJlKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdtb2RhbC1vcGVuJyk7XG4gICAgICAgIGJpZ1BpY3R1cmVDbGlja0hhbmRsZXIoZXZ0LCBkYXRhKTtcblxuICAgIH0pO1xuICAgIHJldHVybiBuZXdFbGVtZW50O1xufTtcblxuLy8tLS0t0KDQtdC90LTQtdGA0LjRgiDRjdC70LXQvNC10L3RgtGLINC90LAg0YHRgtGA0LDQvdC40YbRgyDRgSDQtNCw0L3QvdGL0LzQuCDQuNC3INC80LDRgdGB0LjQstCwIGRhdGEg0YEg0LzQsNC/0LDQvNC4LS0tLS8vXG5mdW5jdGlvbiByZW5kZXJQaWN0dXJlRWxlbWVudHMoZGF0YSkge1xuXG4gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGZvciAobGV0IGl0ZW0gb2YgZGF0YSkge1xuICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChtYWtlUGljdHVyZUVsZW1lbnQoaXRlbSkpO1xuICAgIH1cbiAgICBwaWN0dXJlc0NvbnRhaW5lci5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4gICAgZmlsdGVycy5jbGFzc0xpc3QucmVtb3ZlKCdpbWctZmlsdGVycy0taW5hY3RpdmUnKTtcbn1cblxuZXhwb3J0IHtyZW5kZXJQaWN0dXJlRWxlbWVudHN9O1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbiIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzLmpzJ1xuXG5jb25zdCB1cGxvYWRTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmltZy11cGxvYWQnKTtcbmNvbnN0IGhhc2hUYWcgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0X19oYXNodGFncycpO1xuY29uc3QgdGV4dEFyZWEgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0X19kZXNjcmlwdGlvbicpO1xuY29uc3Qgc3VibWl0QnV0dG9uID0gdXBsb2FkU2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcuaW1nLXVwbG9hZF9fc3VibWl0Jyk7XG5cbmZ1bmN0aW9uIGhhc2hUYWdWYWxpZGF0ZUhhbmRsZXIgKGVsZW1lbnQpIHtcblxuICAgIGxldCByZWdFeHAgPSAvKCNbXiNcXHNdezEsMTl9KS9nO1xuICAgIGxldCBzdHIgPSBlbGVtZW50LnZhbHVlO1xuICAgIGxldCBhcnIgPSBzdHIubWF0Y2gocmVnRXhwKTtcbiAgICBsZXQgaXNUcnVlID0gKHJlZ0V4cCwgc3RyKSA9PiByZWdFeHAudGVzdChzdHIpO1xuXG4gICAgaWYgKGlzVHJ1ZSgvKD88IVxcdykjKD8hXFx3KS8sIHN0cikpIHtcbiAgICAgICAgZWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eSgn0KXQtdGILdGC0LXQsyDQvdC1INC80L7QttC10YIg0YHQvtGB0YLQvtGP0YLRjCDRgtC+0LvRjNC60L4g0LjQtyDQvtC00L3QvtC5INGA0LXRiNGR0YLQutC4Jyk7XG4gICAgICAgIGVsZW1lbnQucmVwb3J0VmFsaWRpdHkoKTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gJzNweCBzb2xpZCByZWQnO1xuXG4gICAgfSBlbHNlIGlmIChpc1RydWUoL1teI1xcd1xcc117MSx9KD89LiopfCgoPzwhIykoXFxiXFx3ezEsMTl9XFxiID8pezEsNX0pLywgc3RyKSkge1xuICAgICAgICBlbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KCfQpdC10Ygt0YLQtdCzINC90LDRh9C40L3QsNC10YLRgdGPIGMg0YDQtdGI0LXRgtGI0LrQuCcpO1xuICAgICAgICBlbGVtZW50LnJlcG9ydFZhbGlkaXR5KCk7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3V0bGluZSA9ICczcHggc29saWQgcmVkJztcblxuICAgIH0gZWxzZSBpZiAoaXNUcnVlKC8oI1xcd3sxLDE5fSNcXHcqKXsxLDV9Lywgc3RyKSkge1xuICAgICAgICBlbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KCfQpdGN0Ygt0YLQtdCz0Lgg0YDQsNC30LTQtdC70Y/RjtGC0YHRjyDQv9GA0L7QsdC10LvQsNC80LgnKTtcbiAgICAgICAgZWxlbWVudC5yZXBvcnRWYWxpZGl0eSgpO1xuICAgICAgICBlbGVtZW50LnN0eWxlLm91dGxpbmUgPSAnM3B4IHNvbGlkIHJlZCc7XG4gICAgfSBlbHNlIGlmIChpc1RydWUoLygoPzw9XFxzKSMoPyFcXHcpKS8sIHN0cikpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3NzZCcpO1xuICAgICAgICBlbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KCfQpdC10Ygt0YLQtdCzINC90LUg0LzQvtC20LXRgiDRgdC+0YHRgtC+0Y/RgtGMINGC0L7Qu9GM0LrQviDQuNC3INC+0LTQvdC+0Lkg0YDQtdGI0ZHRgtC60Lg7Jyk7XG4gICAgICAgIGVsZW1lbnQucmVwb3J0VmFsaWRpdHkoKTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gJzNweCBzb2xpZCByZWQnO1xuICAgIH0gZWxzZSBpZiAoaXNUcnVlKC8oI1teI1xcc117MSwxOX0gPyl7Nix9Lywgc3RyKSkge1xuICAgICAgICBlbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KCfQndC10LvRjNC30Y8g0YPQutCw0LfQsNGC0Ywg0LHQvtC70YzRiNC1INC/0Y/RgtC4INGF0Y3RiC3RgtC10LPQvtCyJyk7XG4gICAgICAgIGVsZW1lbnQucmVwb3J0VmFsaWRpdHkoKTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gJzNweCBzb2xpZCByZWQnO1xuICAgIH0gZWxzZSBpZiAoaXNUcnVlKC8oI1teI1xcc117MjAsfSA/KS8sIHN0cikpIHtcbiAgICAgICAgZWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eSgn0JzQsNC60YHQuNC80LDQu9GM0L3QsNGPINC00LvQuNC90LAg0L7QtNC90L7Qs9C+INGF0Y3RiC3RgtC10LPQsCDQvNC+0LbQtdGCINCx0YvRgtGMIDIwINGB0LjQvNCy0L7Qu9C+0LIsINCy0LrQu9GO0YfQsNGPINGA0LXRiNGR0YLQutGDJyk7XG4gICAgICAgIGVsZW1lbnQucmVwb3J0VmFsaWRpdHkoKTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gJzNweCBzb2xpZCByZWQnO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkoJycpO1xuICAgICAgICBlbGVtZW50LnJlcG9ydFZhbGlkaXR5KCk7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3V0bGluZSA9ICcnO1xuXG5cbiAgICB9XG4gICAgaWYgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXJyLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5zcGxpdCgnLCcpO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdCkge1xuICAgICAgICAgICAgbGV0IHNpbWlsaWFyID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT09IHJlc3VsdFtpXSkge1xuICAgICAgICAgICAgICAgICAgICBzaW1pbGlhcisrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNpbWlsaWFyID4gMSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkoJ9Ce0LTQuNC9INC4INGC0L7RgiDQttC1INGF0Y3RiC3RgtC10LMg0L3QtSDQvNC+0LbQtdGCINCx0YvRgtGMINC40YHQv9C+0LvRjNC30L7QstCw0L0g0LTQstCw0LbQtNGLJyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXBvcnRWYWxpZGl0eSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3V0bGluZSA9ICczcHggc29saWQgcmVkJztcblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbn07XG5cblxuZnVuY3Rpb24gdGV4dEFyZWFWYWxpZGF0ZUhhbmRsZXIgKGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC52YWxpZGl0eS50b29Mb25nKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkoJ9C00LvQuNC90LAg0LrQvtC80LzQtdC90YLQsNGA0LjRjyDQvdC1INC80L7QttC10YIg0YHQvtGB0YLQsNCy0LvRj9GC0Ywg0LHQvtC70YzRiNC1IDE0MCDRgdC40LzQstC+0LvQvtCyJyk7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3V0bGluZSA9ICczcHggc29saWQgcmVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KCcnKTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gJyc7XG4gICAgfVxuXG59O1xuXG5zdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgaGFzaFRhZ1ZhbGlkYXRlSGFuZGxlcihoYXNoVGFnKTtcbiAgICB0ZXh0QXJlYVZhbGlkYXRlSGFuZGxlcih0ZXh0QXJlYSk7XG59KTtcblxuaGFzaFRhZy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2dCkge1xuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbn0pXG5cbnRleHRBcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xufSlcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5kZWJ1Z2dlclxuaW1wb3J0IHtyZXNldFRvRGVmYXVsdH0gZnJvbSAnLi9waWN0dXJlLWVmZmVjdHMuanMnO1xuLy8gaW1wb3J0IHtkYXRhfSBmcm9tICcuL2RhdGEuanMnO1xuaW1wb3J0IHtkYXRhfSBmcm9tICcuL2JhY2tlbmQuanMnXG5pbXBvcnQgKiBhcyBiYWNrZW5kIGZyb20gJy4vYmFja2VuZC5qcyc7XG5pbXBvcnQge3JlbmRlclBpY3R1cmVFbGVtZW50cywgY2xlYXJQaWN0dXJlc30gZnJvbSAnLi9waWN0dXJlcy5qcyc7XG5pbXBvcnQgJy4vZm9ybS12YWxpZGF0aW9uLmpzJztcbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMuanMnXG5pbXBvcnQgKiBhcyBmaWx0ZXJzIGZyb20gJy4vZmlsdGVycy5qcyc7XG5cblxuY29uc3QgZGVmYXVsdEZpbHRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmaWx0ZXItZGVmYXVsdCcpO1xuY29uc3QgZmlsdGVyUmFuZG9tID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbHRlci1yYW5kb20nKTtcbmNvbnN0IGZpbHRlckRpc3NjdXNzZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZmlsdGVyLWRpc2N1c3NlZCcpO1xuY29uc3QgcGljdHVyZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGljdHVyZXMnKTtcbmNvbnN0IHBpY3R1cmUgPSBwaWN0dXJlc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcucGljdHVyZXMnKVxuY29uc3QgZmlsdGVyQnV0dG9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbWctZmlsdGVyc19fYnV0dG9uJylcblxuXG4vLy0tLS3Qn9C10YDQtdC80L3QsNGPINGC0LXQutGD0YnQtdCz0L4g0YTQuNC70YzRgtGA0LAg0LjQt9C+0LHRgNCw0LbQtdC90LjQuSDQtNGAINC/0L7Qu9GM0LfQsNCy0LDRgtC10LvQtdC5LCDRjdC60YHQv9C+0YDRgiDQsiBmaWx0ZXJzLS0tLS8vXG5leHBvcnQgbGV0IGNsaWNrZWRGSWx0ZXI9ICdmaWx0ZXItZGVmYXVsdCc7XG5cblxuLy8tLS0t0J7QsdGA0LDQsdC+0YLRh9C40LrQuCDRhNC40LvRjNGC0YDQvtCyINC40LfQvtCx0YDQsNC20LXQvdC40Lkg0LTRgCDQv9C+0LvRjNC30LDQstCw0YLQtdC70LXQuS0tLS0vL1xuZmlsdGVyRGlzc2N1c3NlZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBjbGlja2VkRklsdGVyPWUudGFyZ2V0LmlkO1xuICAgIGNsZWFyUGljdHVyZXMoKTtcbiAgICB1dGlscy5jbGFzc1RvZ2dsZXIoZmlsdGVyQnV0dG9ucyxmaWx0ZXJEaXNzY3Vzc2VkKVxuICAgIHJlbmRlclBpY3R1cmVFbGVtZW50cyhmaWx0ZXJzLnNvcnRCeVBvcHVsYXJpdHkoZGF0YSkpO1xufSk7XG5cbmRlZmF1bHRGaWx0ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgY2xpY2tlZEZJbHRlcj1lLnRhcmdldC5pZDtcbiAgICBjbGVhclBpY3R1cmVzKCk7XG4gICAgdXRpbHMuY2xhc3NUb2dnbGVyKGZpbHRlckJ1dHRvbnMsZGVmYXVsdEZpbHRlcilcbiAgICByZW5kZXJQaWN0dXJlRWxlbWVudHMoZGF0YSk7XG59KTtcblxuZmlsdGVyUmFuZG9tLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGNsaWNrZWRGSWx0ZXI9ZS50YXJnZXQuaWQ7XG4gICAgY2xlYXJQaWN0dXJlcygpO1xuICAgIHV0aWxzLmNsYXNzVG9nZ2xlcihmaWx0ZXJCdXR0b25zLGZpbHRlclJhbmRvbSlcbiAgICByZW5kZXJQaWN0dXJlRWxlbWVudHMoZmlsdGVycy5zb3J0QnlSYW5kb20oZGF0YSkpO1xufSk7XG5cbi8vcmVuZGVyUGljdHVyZUVsZW1lbnRzKGRhdGEpOyDQldGB0LvQuCDQvdC1INGA0LDQsdC+0YLQsNC10YIg0YHQtdGA0LLQtdGAXG5cbmJhY2tlbmQuYWpheEdldFJlcXVlc3QocmVuZGVyUGljdHVyZUVsZW1lbnRzKTtcblxuXG4iXSwibmFtZXMiOlsiZXNjRXZlbnRDb2RlIiwiZWxlbWVudFRvQ2xvc2UiLCJpc0VzY1ByZXNzZWQiLCJldnQiLCJjb2RlIiwiZ2V0UmFuZG9tSW50IiwibWF4IiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiZXNjUHJlc3NIYW5kbGVyIiwiY2xvc2VFbGVtZW50IiwiZGVsZXRlQmxvYkltYWdlIiwib3BlbkVsZW1lbnQiLCJlbGVtZW50IiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiYWRkIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImJvZHkiLCJyZXNldFRvRGVmYXVsdCIsImZvcm0iLCJyZXNldCIsImNsYXNzVG9nZ2xlciIsImFyclRvY2xlYXIiLCJmb3JFYWNoIiwiaXRlbSIsInhoclN0YXR1cyIsIk9LIiwiZGF0YSIsImFqYXhHZXRSZXF1ZXN0Iiwib25TdWNjZXNzQ2IiLCJvbkVycm9yIiwiZXJyb3JIYW5kbGVyIiwieGhyIiwiWE1MSHR0cFJlcXVlc3QiLCJyZXNwb25zZVR5cGUiLCJ1cmwiLCJzdGF0dXMiLCJyZXNwb25zZSIsInN0YXR1c1RleHQiLCJ0aW1lb3V0Iiwib3BlbiIsInNlbmQiLCJhamF4UG9zdFJlcXVlc3QiLCJvblN1Y2Nlc3MiLCJtZXNzYWdlIiwibmV3RWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjb250ZW50IiwiY2xvbmVOb2RlIiwidGV4dENvbnRlbnQiLCJlIiwidXRpbHMiLCJjbGljayIsIm9uY2UiLCJhcHBlbmQiLCJ1cGxvYWRTZWN0aW9uIiwidXBsb2FkQnV0dG9uIiwiZWRpdEZvcm0iLCJpbWFnZUlucHV0IiwiZWRpdEZvcm1DbG9zZUJ1dHRvbiIsInByZXZpZXdQaG90byIsInByZXZpZXdQaG90b0ltZyIsInNjYWxlQ29udHJvbE1pbnVzIiwic2NhbGVDb250cm9sUGx1cyIsInNjYWxlQ29udHJvbElucHV0IiwiZWZmZWN0UHJldmlld0ltZyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJlZmZlY3RFbGVtZW50IiwiZWZmZWN0VmFsdWUiLCJlZmZlY3RzQmxvY2siLCJjaGVja2VkUmFkaW8iLCJlZmZlY3REZXB0aCIsInBpbkxldmVsTGluZSIsInBpbiIsImhhc2hUYWciLCJlZmZlY3RWYWx1ZVRvQ2xhc3NOYW1lIiwiY2hyb21lIiwic2VwaWEiLCJtYXJ2aW4iLCJwaG9ib3MiLCJoZWF0IiwiZWZmZWN0VmFsdWVUb0ZpbHRlck5hbWUiLCJlZmZlY3RWYWx1ZVRvZmlsdGVyQ2FsbGJhY2siLCJpbmRleCIsImNzc0luZGV4Iiwib2Zmc2V0V2lkdGgiLCJzdHlsZSIsImZpbHRlciIsImN1cnJlbnRGaWx0ZXIiLCJ0cmFuc2Zvcm1Ub0NhbGxiYWNrIiwic2NhbGUiLCJwYXJzZUludCIsInRyYW5zZm9ybSIsImNsaWNrZWRDbGFzcyIsImNsaWNrZWROb2RlIiwiZmlsdGVyQ2FsbGJhY2siLCJ2YWx1ZSIsImxlZnQiLCJ3aWR0aCIsIm91dGxpbmUiLCJzY2FsZU1pbnVzQ2xpY2tIYW5kbGVyIiwiY2FsbGJhY2siLCJzY2FsZVN0ZXAiLCJzY2FsZVZhbHVlIiwic2NhbGVQbHVzQ2xpY2tIYW5kbGVyIiwibWF4U2NhbGUiLCJlZmZlY3RDaGFuZ2VIYW5kbGVyIiwidGFyZ2V0IiwicGluTW91c2VEb3duSGFuZGxlciIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzaGlmdFgiLCJjbGllbnRYIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibW91c2VNb3ZlSGFuZGxlciIsIm5ld0xlZnQiLCJyaWdodEVkZ2UiLCJpbnB1dFZhbHVlT2ZFZkxldmVsIiwicm91bmQiLCJtb3VzZVVwSGFuZGxlciIsIm9uZHJhZ3N0YXJ0Iiwic2hvd0Jsb2JJbWciLCJibG9iSW1hZ2UiLCJmaWxlcyIsInNyYyIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImJhY2tncm91bmRJbWFnZSIsInJldm9rZU9iamVjdFVSTCIsIkZvcm1EYXRhIiwic2V0QXR0cmlidXRlIiwic2V0VGltZW91dCIsImZpbHRlcklkVG9EYXRhIiwic29ydEJ5UG9wdWxhcml0eSIsImRhdGFDb3B5Iiwic2xpY2UiLCJuZXdBcnIiLCJzb3J0IiwiYSIsImIiLCJjb21tZW50cyIsImxlbmd0aCIsInNvcnRCeVJhbmRvbSIsInJhbmRvbU51bWJlcnMiLCJzb21lIiwicHVzaCIsInJhbmRvbUFycmF5IiwibWFwIiwidXBsb2FkU29jaWFsQnV0dG9uIiwiYmlnUGljdHVyZSIsImJpZ1BpY3R1cmVJbWciLCJiaWdQaWN0dXJlQ2xvc2VCdXR0b24iLCJsaWtlc0NvdW50IiwicGhvdG9EaXNjcml0aW9uIiwic29jaWFsQ29tbWVudGJsb2NrIiwiY2hpbGRyZW4iLCJibG9ja09mY29tbWVudHMiLCJjb21tZW50c0NvdW50IiwiY29tbWVudFRleHQiLCJzb2NpYWxBdmF0YXIiLCJsb2FkQ29tbWVudEJ1dHRvbiIsImNvbW1lbnRJbnB1dCIsInVwbG9hZENvbW1lbnQiLCJjb21tZW50VGVtcGxhdGUiLCJjb21tZW50Q291bnQiLCJjbGlja2VkSXRlbSIsImJpZ1BpY3R1cmVDbGlja0hhbmRsZXIiLCJhcHBlbmRQaWN0dXJlRGF0YSIsImRlbGV0ZU5vZGVzIiwicmVuZGVyQ29tbWVudEVsZW1lbnRzIiwic2hvd0N1cnJlbnRDb21tZW50c0NvdW50IiwibGlrZXMiLCJkZXNjcmlwdGlvbiIsImNlaWwiLCJlbGVtZW50cyIsIm1ha2VDb21tZW50RWxlbWVudCIsImF2YXRhciIsImNvbnRhaW5lciIsImZyYWdtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsImFwcGVuZENoaWxkIiwic2hvd0hpZGRlbkNvbW1lbnRzIiwiY29tbWVudCIsImFkZENvbW1lbnQiLCJpbnNlcnRBZGphY2VudEVsZW1lbnQiLCJmYWtlUHVzaFRvU2VydmVyIiwiZmluZCIsIm1hdGNoIiwidW5zaGlmdCIsImNsZWFyUGljdHVyZXMiLCJyZW5kZXJQaWN0dXJlRWxlbWVudHMiLCJmaWx0ZXJzIiwiY2xpY2tlZEZJbHRlciIsInBpY3R1cmVzQ29udGFpbmVyIiwicGljdHVyZVRlbXBsYXRlIiwibWFrZVBpY3R1cmVFbGVtZW50IiwidGV4dEFyZWEiLCJzdWJtaXRCdXR0b24iLCJoYXNoVGFnVmFsaWRhdGVIYW5kbGVyIiwicmVnRXhwIiwic3RyIiwiYXJyIiwiaXNUcnVlIiwidGVzdCIsInNldEN1c3RvbVZhbGlkaXR5IiwicmVwb3J0VmFsaWRpdHkiLCJjb25zb2xlIiwibG9nIiwicmVzdWx0IiwidG9TdHJpbmciLCJ0b0xvd2VyQ2FzZSIsInNwbGl0Iiwic2ltaWxpYXIiLCJpIiwidGV4dEFyZWFWYWxpZGF0ZUhhbmRsZXIiLCJ2YWxpZGl0eSIsInRvb0xvbmciLCJzdG9wUHJvcGFnYXRpb24iLCJkZWZhdWx0RmlsdGVyIiwiZmlsdGVyUmFuZG9tIiwiZmlsdGVyRGlzc2N1c3NlZCIsInBpY3R1cmUiLCJmaWx0ZXJCdXR0b25zIiwiaWQiLCJiYWNrZW5kIl0sIm1hcHBpbmdzIjoiOzs7SUFNQSxNQUFNQSxZQUFZLEdBQUcsUUFBckI7SUFDQSxJQUFJQyxjQUFKOztJQUVBLE1BQU1DLFlBQVksR0FBR0MsR0FBRyxJQUFJQSxHQUFHLENBQUNDLElBQUosS0FBYUosWUFBekM7O0lBS0EsU0FBU0ssWUFBVCxDQUFzQkMsR0FBdEIsRUFBMkI7SUFDdkIsU0FBT0MsSUFBSSxDQUFDQyxLQUFMLENBQVdELElBQUksQ0FBQ0UsTUFBTCxLQUFnQkgsR0FBM0IsQ0FBUDtJQUNIOztJQUdELE1BQU1JLGVBQWUsR0FBSVAsR0FBRCxJQUFTO0lBQzdCLE1BQUlELFlBQVksQ0FBQ0MsR0FBRCxDQUFoQixFQUF1QjtJQUNuQlEsSUFBQUEsWUFBWSxDQUFDVixjQUFELENBQVo7SUFDQVcsSUFBQUEsZUFBZTtJQUNsQjtJQUNKLENBTEQ7O0lBT0EsTUFBTUMsV0FBVyxHQUFJQyxPQUFELElBQWE7SUFDN0JBLEVBQUFBLE9BQU8sQ0FBQ0MsU0FBUixDQUFrQkMsTUFBbEIsQ0FBeUIsUUFBekI7SUFDQWYsRUFBQUEsY0FBYyxHQUFHYSxPQUFqQjtJQUNB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
