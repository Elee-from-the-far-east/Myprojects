(function () {
    'use strict';

    const escEventCode = 'Escape';
    let elementToClose;

    const isEscPressed = evt => evt.code === escEventCode;

    const escPressHandler = evt => {
      if (isEscPressed(evt)) {
        closeElement(elementToClose);
        resetToDefault();
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
    };

    const uploadSection = document.querySelector('.img-upload');
    const uploadButton = uploadSection.querySelector('#upload-file');
    const form = uploadSection.querySelector('form');
    const editForm = uploadSection.querySelector('.img-upload__overlay');
    const editFormCloseButton = uploadSection.querySelector('.img-upload__cancel');
    const previewPhoto = uploadSection.querySelector('.img-upload__preview');
    const scaleControlMinus = uploadSection.querySelector('.scale__control--smaller');
    const scaleControlPlus = uploadSection.querySelector('.scale__control--bigger');
    const scaleControlInput = uploadSection.querySelector('.scale__control--value');
    const effectElement = uploadSection.querySelector('.effect-level');
    const effectValue = uploadSection.querySelector('.effect-level__value');
    const effectsBlock = uploadSection.querySelector('.effects__list');
    const checkedRadio = uploadSection.querySelector('input[checked]');
    const effectDepth = uploadSection.querySelector('.effect-level__depth');
    const pinLevelLine = document.querySelector('.effect-level__line');
    const pin = uploadSection.querySelector('.effect-level__pin');
    let clickedClass;
    let clickedNode;
    let currentFilter;
    effectValue.value = 0;
    scaleControlInput.value = '100%';
    closeElement(effectElement);

    const scaleMinusClickHandler = () => {
      let scaleStep = 25;
      let scaleValue = parseInt(scaleControlInput.value);
      if (scaleValue > scaleStep) scaleControlInput.value = scaleValue - scaleStep + '%';
      let cssScaleIndex = parseInt(scaleControlInput.value) / 100;
      previewPhoto.style.transform = `scale(${cssScaleIndex})`;
    };

    const scalePlusClickHandler = () => {
      let scaleStep = 25;
      let maxScale = 100;
      let scaleValue = parseInt(scaleControlInput.value);
      if (scaleValue < maxScale) scaleControlInput.value = scaleValue + scaleStep + '%';
      let cssScaleIndex = parseInt(scaleControlInput.value) / 100;
      previewPhoto.style.transform = `scale(${cssScaleIndex})`;
    };

    const effectChangeHandler = evt => {
      clickedNode = evt.target;
      currentFilter = clickedNode.dataset.filter;
      clickedClass = `effects__preview--${evt.target.value}`;
      previewPhoto.classList.add(`effects__preview--${evt.target.value}`);
      resetToDefault();
    };

    const resetToDefault = () => {
      if (clickedClass) previewPhoto.classList.remove(clickedClass);
      if (currentFilter) previewPhoto.style.filter = '';

      if (clickedNode && clickedNode.value !== 'none') {
        effectElement.classList.remove('hidden');
      }

      pin.style.left = '100%';
      effectDepth.style.width = '100%';
      effectValue.value = 100;
      previewPhoto.style.transform = 'scale(1)';
      scaleControlInput.value = '100%';
    };

    const pinMouseDownHandler = () => {
      event.preventDefault();
      let shiftX = event.clientX - pin.getBoundingClientRect().left;

      const mouseMoveHandler = event => {
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
        let cssIndex = newLeft / pinLevelLine.offsetWidth;
        let cssIndexPx = newLeft * 3 / pinLevelLine.offsetWidth + 'px';
        let cssIndex100 = newLeft / pinLevelLine.offsetWidth * 100 + '%';
        let cssIndexBright = 1 + 2 * newLeft / pinLevelLine.offsetWidth;
        let inputValueOfEfLevel = newLeft / pinLevelLine.offsetWidth * 100;
        effectValue.value = inputValueOfEfLevel;

        if (currentFilter && currentFilter === "sepia" || currentFilter === "grayscale") {
          previewPhoto.style.filter = `${currentFilter}(${cssIndex})`;
        }

        if (currentFilter && currentFilter === "invert") {
          previewPhoto.style.filter = `${currentFilter}(${cssIndex100})`;
        }

        if (currentFilter && currentFilter === "blur") {
          previewPhoto.style.filter = `${currentFilter}(${cssIndexPx})`;
        }

        if (currentFilter && currentFilter === "brightness") {
          previewPhoto.style.filter = `${currentFilter}(${cssIndexBright})`;
        }
      };

      const mouseUpHandler = () => {
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
      };

      document.addEventListener("mousemove", mouseMoveHandler);
      document.addEventListener("mouseup", mouseUpHandler);

      pin.ondragstart = function () {
        return false;
      };
    };

    pin.addEventListener('mousedown', function (event) {
      pinMouseDownHandler();
    });
    effectsBlock.addEventListener('change', effectChangeHandler);
    checkedRadio.addEventListener('click', function () {
      closeElement(effectElement);
    });
    scaleControlPlus.addEventListener('click', scalePlusClickHandler);
    scaleControlMinus.addEventListener('click', scaleMinusClickHandler);
    uploadButton.addEventListener('change', function (evt) {
      openElement(editForm);
    });
    editFormCloseButton.addEventListener('click', function (evt) {
      closeElement(editForm);
      resetToDefault();
    });
    if (editForm.classList.contains('hidden')) resetToDefault();

    const uploadSocialButton = document.querySelector('.comments-loader');
    const bigPicture = document.querySelector('.big-picture');
    const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
    const bigPictureCloseButton = bigPicture.querySelector('.big-picture__cancel');
    const likesCount = bigPicture.querySelector('.likes-count');
    const photoDiscrition = bigPicture.querySelector('.social__caption');
    const commentsCount = bigPicture.querySelector('.comments-count');
    const commentText = document.querySelectorAll('.social__text');
    const socialCommentblock = document.querySelector('.social__comment-count');
    const socialAvatar = bigPicture.querySelector('.social__picture');
    const picturesContainer = document.querySelector('.pictures');
    const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

    function showBigPicture(data) {
      bigPictureImg.src = data.url;
      likesCount.textContent = data.likes;
      photoDiscrition.textContent = data.description;

      for (let i = 0; i < commentText.length; i++) {
        commentText[i].textContent = data.comments[i];
      }
    }

    function makePictureElement(data) {
      let newElement = pictureTemplate.cloneNode(true);
      newElement.querySelector('.picture__img').src = data.url;
      newElement.querySelector('.picture__likes').textContent = data.likes;
      newElement.querySelector('.picture__comments').textContent = data.comments;
      newElement.addEventListener('click', function (evt) {
        openElement(bigPicture);
        showBigPicture(data);
      });
      return newElement;
    }

    function renderPictureElements(data) {
      let fragment = document.createDocumentFragment();

      for (let item of data) {
        fragment.appendChild(makePictureElement(item));
      }

      picturesContainer.appendChild(fragment);
    } // // Не понятно 5 из восьми комментариев
    // commentsCount.textContent = photoData.comments.length;


    socialAvatar.src = `img/avatar-${Math.ceil(Math.random() * 6)}.svg`;
    socialCommentblock.classList.add('visually-hidden');
    uploadSocialButton.classList.add('visually-hidden');
    bigPictureCloseButton.addEventListener('click', function () {
      closeElement(bigPicture);
    });

    const numberOfObjects = 25;
    const minLikes = 15;
    const maxLikes = 200;
    const DATA = {
      url: [],
      likes: [],
      comments: ['Всё отлично!', 'В целом всё неплохо. Но не всё', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра', 'В конце концов это просто непрофессионально', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше', 'Лица у людей на фотке перекошены, как будто их избивают', 'Как можно было поймать такой неудачный момент?!'],
      description: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье.', 'Цените тех, кто рядом с вами и отгоняйте все сомненья.', 'Не обижайте всех словами......', 'Вот это тачка!']
    };

    (function () {
      for (let i = 1; i <= numberOfObjects; i++) {
        DATA.url.push(`photos/${i}.jpg`);
      }
    })();

    (function () {
      for (let i = minLikes; i <= maxLikes; i++) {
        DATA.likes.push(i);
      }
    })();

    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const photoData = [];

    function makePhotoDataObj(data, container, totalObj) {
      for (let i = 0; i < totalObj; i++) {
        let obj = {};

        for (let dataKey in data) {
          let randomNumber = getRandomInt(data[dataKey].length - 1);

          if (dataKey === 'url') {
            obj[dataKey] = data[dataKey][i];
          }

          if (dataKey === 'comments') {
            obj[dataKey] = [];

            for (let i = 0; i < 2; i++) {
              obj[dataKey].push(data[dataKey][getRandomInt(data[dataKey].length - 1)]);
            }
          }

          if (dataKey !== 'urlNumbers' && dataKey !== 'likesNumbers' && dataKey !== 'url' && dataKey !== 'comments') {
            obj[dataKey] = data[dataKey][randomNumber];
          }
        }

        container.push(obj);
      }
    }

    makePhotoDataObj(DATA, photoData, numberOfObjects);

    const uploadSection$1 = document.querySelector('.img-upload');
    const hashTag = uploadSection$1.querySelector('.text__hashtags');
    const textArea = uploadSection$1.querySelector('.text__description');
    const submitButton = uploadSection$1.querySelector('.img-upload__submit');

    const hashTagValidateHandler = element => {
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
    };

    const textAreaValidateHandler = element => {
      if (element.validity.tooLong) {
        element.setCustomValidity('длина комментария не может составлять больше 140 символов');
        element.style.outline = '3px solid red';
      } else {
        element.setCustomValidity('');
        element.style.outline = '';
      }
    };

    submitButton.addEventListener('click', function () {
      hashTagValidateHandler(hashTag);
      textAreaValidateHandler(textArea);
    });
    hashTag.addEventListener('keydown', function (evt) {
      evt.stopPropagation();
    });
    textArea.addEventListener('keydown', function (evt) {
      evt.stopPropagation();
    });

    renderPictureElements(photoData);

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vanMvdXRpbHMuanMiLCIuLi9qcy9waWN0dXJlLWVmZmVjdHMuanMiLCIuLi9qcy9waWN0dXJlcy5qcyIsIi4uL2pzL3JlbmRlci1yYW5kb20tZGF0YS5qcyIsIi4uL2pzL2Zvcm0tdmFsaWRhdGlvbi5qcyIsIi4uL2pzL21haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7cmVzZXRUb0RlZmF1bHR9IGZyb20gJy4vcGljdHVyZS1lZmZlY3RzLmpzJ1xuXG5cbmNvbnN0IGVudGVyRXZlbnRDb2RlID0gJ0VudGVyJztcbmNvbnN0IGVzY0V2ZW50Q29kZSA9ICdFc2NhcGUnO1xubGV0IGVsZW1lbnRUb0Nsb3NlO1xuXG5jb25zdCBpc0VzY1ByZXNzZWQgPSBldnQgPT4gZXZ0LmNvZGUgPT09IGVzY0V2ZW50Q29kZTtcbmNvbnN0IGlzRW50ZXJQcmVzc2VkID0gZXZ0ID0+IGV2dC5jb2RlID09PSBlbnRlckV2ZW50Q29kZTtcbmxldCBjaGVjayA9IChlbGVtKSA9PiBjb25zb2xlLmxvZyhlbGVtKTtcblxuXG5jb25zdCBlc2NQcmVzc0hhbmRsZXIgPSAoZXZ0KSA9PiB7XG4gICAgaWYgKGlzRXNjUHJlc3NlZChldnQpKSB7XG4gICAgICAgIGNsb3NlRWxlbWVudChlbGVtZW50VG9DbG9zZSk7XG4gICAgICAgIHJlc2V0VG9EZWZhdWx0KClcbiAgICB9XG59O1xuXG5jb25zdCBvcGVuRWxlbWVudCA9IChlbGVtZW50KSA9PiB7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcbiAgICBlbGVtZW50VG9DbG9zZSA9IGVsZW1lbnQ7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGVzY1ByZXNzSGFuZGxlcik7XG59O1xuXG5jb25zdCBjbG9zZUVsZW1lbnQgPSAoZWxlbWVudCkgPT4ge1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGVzY1ByZXNzSGFuZGxlcik7XG59O1xuXG5cblxuZXhwb3J0IHtcbiAgICBvcGVuRWxlbWVudCxcbiAgICBjbG9zZUVsZW1lbnQsXG4gICAgY2hlY2ssXG4gICAgZXNjUHJlc3NIYW5kbGVyLFxuICAgIGlzRXNjUHJlc3NlZCxcbiAgICBpc0VudGVyUHJlc3NlZFxufTtcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cblxuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscy5qcydcblxuXG5jb25zdCB1cGxvYWRTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmltZy11cGxvYWQnKTtcbmNvbnN0IHVwbG9hZEJ1dHRvbiA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignI3VwbG9hZC1maWxlJyk7XG5jb25zdCBmb3JtID0gdXBsb2FkU2VjdGlvbi5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG5jb25zdCBlZGl0Rm9ybSA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLmltZy11cGxvYWRfX292ZXJsYXknKTtcbmNvbnN0IGVkaXRGb3JtQ2xvc2VCdXR0b24gPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5pbWctdXBsb2FkX19jYW5jZWwnKTtcbmNvbnN0IHByZXZpZXdQaG90byA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLmltZy11cGxvYWRfX3ByZXZpZXcnKTtcbmNvbnN0IHNjYWxlQ29udHJvbE1pbnVzID0gdXBsb2FkU2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcuc2NhbGVfX2NvbnRyb2wtLXNtYWxsZXInKTtcbmNvbnN0IHNjYWxlQ29udHJvbFBsdXMgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5zY2FsZV9fY29udHJvbC0tYmlnZ2VyJyk7XG5jb25zdCBzY2FsZUNvbnRyb2xJbnB1dCA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLnNjYWxlX19jb250cm9sLS12YWx1ZScpO1xuY29uc3QgZWZmZWN0RWxlbWVudCA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLmVmZmVjdC1sZXZlbCcpO1xuY29uc3QgZWZmZWN0VmFsdWUgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5lZmZlY3QtbGV2ZWxfX3ZhbHVlJyk7XG5jb25zdCBlZmZlY3RzQmxvY2sgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy5lZmZlY3RzX19saXN0Jyk7XG5jb25zdCBjaGVja2VkUmFkaW8gPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W2NoZWNrZWRdJyk7XG5jb25zdCBlZmZlY3REZXB0aCA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLmVmZmVjdC1sZXZlbF9fZGVwdGgnKTtcbmNvbnN0IHBpbkxldmVsTGluZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5lZmZlY3QtbGV2ZWxfX2xpbmUnKTtcbmNvbnN0IHBpbiA9IHVwbG9hZFNlY3Rpb24ucXVlcnlTZWxlY3RvcignLmVmZmVjdC1sZXZlbF9fcGluJyk7XG5cblxubGV0IGNsaWNrZWRDbGFzcztcbmxldCBjbGlja2VkTm9kZTtcbmxldCBjdXJyZW50RmlsdGVyO1xuXG5cblxuZWZmZWN0VmFsdWUudmFsdWUgPSAwO1xuc2NhbGVDb250cm9sSW5wdXQudmFsdWUgPSAnMTAwJSc7XG51dGlscy5jbG9zZUVsZW1lbnQoZWZmZWN0RWxlbWVudClcblxuXG5cbmNvbnN0IHNjYWxlTWludXNDbGlja0hhbmRsZXIgPSAoKSA9PiB7XG4gICAgbGV0IHNjYWxlU3RlcCA9IDI1O1xuICAgIGxldCBzY2FsZVZhbHVlID0gcGFyc2VJbnQoc2NhbGVDb250cm9sSW5wdXQudmFsdWUpO1xuICAgIGlmIChzY2FsZVZhbHVlID4gc2NhbGVTdGVwKSBzY2FsZUNvbnRyb2xJbnB1dC52YWx1ZSA9IChzY2FsZVZhbHVlIC0gc2NhbGVTdGVwKSArICclJztcbiAgICBsZXQgY3NzU2NhbGVJbmRleCA9IHBhcnNlSW50KHNjYWxlQ29udHJvbElucHV0LnZhbHVlKSAvIDEwMDtcbiAgICBwcmV2aWV3UGhvdG8uc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7Y3NzU2NhbGVJbmRleH0pYDtcblxufTtcblxuY29uc3Qgc2NhbGVQbHVzQ2xpY2tIYW5kbGVyID0gKCkgPT4ge1xuICAgIGxldCBzY2FsZVN0ZXAgPSAyNTtcbiAgICBsZXQgbWF4U2NhbGUgPSAxMDA7XG4gICAgbGV0IHNjYWxlVmFsdWUgPSBwYXJzZUludChzY2FsZUNvbnRyb2xJbnB1dC52YWx1ZSk7XG4gICAgaWYgKHNjYWxlVmFsdWUgPCBtYXhTY2FsZSkgc2NhbGVDb250cm9sSW5wdXQudmFsdWUgPSAoc2NhbGVWYWx1ZSArIHNjYWxlU3RlcCkgKyAnJSc7XG4gICAgbGV0IGNzc1NjYWxlSW5kZXggPSBwYXJzZUludChzY2FsZUNvbnRyb2xJbnB1dC52YWx1ZSkgLyAxMDA7XG4gICAgcHJldmlld1Bob3RvLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke2Nzc1NjYWxlSW5kZXh9KWA7XG59O1xuXG5cblxuY29uc3QgZWZmZWN0Q2hhbmdlSGFuZGxlciA9IChldnQpID0+IHtcbiAgICBjbGlja2VkTm9kZSA9IGV2dC50YXJnZXQ7XG4gICAgY3VycmVudEZpbHRlciA9IGNsaWNrZWROb2RlLmRhdGFzZXQuZmlsdGVyO1xuICAgIGNsaWNrZWRDbGFzcyA9IGBlZmZlY3RzX19wcmV2aWV3LS0ke2V2dC50YXJnZXQudmFsdWV9YDtcbiAgICBwcmV2aWV3UGhvdG8uY2xhc3NMaXN0LmFkZChgZWZmZWN0c19fcHJldmlldy0tJHtldnQudGFyZ2V0LnZhbHVlfWApO1xuICAgIHJlc2V0VG9EZWZhdWx0KCk7XG59O1xuXG5cbmNvbnN0IHJlc2V0VG9EZWZhdWx0ID0gKCkgPT4ge1xuICAgIGlmIChjbGlja2VkQ2xhc3MpIHByZXZpZXdQaG90by5jbGFzc0xpc3QucmVtb3ZlKGNsaWNrZWRDbGFzcyk7XG4gICAgaWYgKGN1cnJlbnRGaWx0ZXIpIHByZXZpZXdQaG90by5zdHlsZS5maWx0ZXIgPSAnJztcbiAgICBpZiAoY2xpY2tlZE5vZGUgJiYgY2xpY2tlZE5vZGUudmFsdWUgIT09ICdub25lJykge1xuICAgICAgICBlZmZlY3RFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuICAgIH1cbiAgICBwaW4uc3R5bGUubGVmdCA9ICcxMDAlJztcbiAgICBlZmZlY3REZXB0aC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICBlZmZlY3RWYWx1ZS52YWx1ZSA9IDEwMDtcbiAgICBwcmV2aWV3UGhvdG8uc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDEpJztcbiAgICBzY2FsZUNvbnRyb2xJbnB1dC52YWx1ZSA9ICcxMDAlJztcbn07XG5cbmNvbnN0IHBpbk1vdXNlRG93bkhhbmRsZXIgPSAoKT0+e1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgc2hpZnRYID0gZXZlbnQuY2xpZW50WCAtIHBpbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuXG5cbiAgICBjb25zdCBtb3VzZU1vdmVIYW5kbGVyID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGxldCBuZXdMZWZ0ID0gZXZlbnQuY2xpZW50WCAtIHNoaWZ0WCAtIHBpbkxldmVsTGluZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuXG4gICAgICAgIGlmIChuZXdMZWZ0IDwgMCkge1xuICAgICAgICAgICAgbmV3TGVmdCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJpZ2h0RWRnZSA9IHBpbkxldmVsTGluZS5vZmZzZXRXaWR0aDtcbiAgICAgICAgaWYgKG5ld0xlZnQgPiByaWdodEVkZ2UpIHtcbiAgICAgICAgICAgIG5ld0xlZnQgPSByaWdodEVkZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBwaW4uc3R5bGUubGVmdCA9IG5ld0xlZnQgKyAncHgnO1xuICAgICAgICBlZmZlY3REZXB0aC5zdHlsZS53aWR0aCA9IG5ld0xlZnQgKyAncHgnO1xuXG5cbiAgICAgICAgbGV0IGNzc0luZGV4ID0gbmV3TGVmdCAvIHBpbkxldmVsTGluZS5vZmZzZXRXaWR0aDtcbiAgICAgICAgbGV0IGNzc0luZGV4UHggPSBuZXdMZWZ0ICogMyAvIHBpbkxldmVsTGluZS5vZmZzZXRXaWR0aCArICdweCc7XG4gICAgICAgIGxldCBjc3NJbmRleDEwMCA9IG5ld0xlZnQgLyBwaW5MZXZlbExpbmUub2Zmc2V0V2lkdGggKiAxMDAgKyAnJSc7XG4gICAgICAgIGxldCBjc3NJbmRleEJyaWdodCA9IDEgKyAoMiAqIG5ld0xlZnQgLyBwaW5MZXZlbExpbmUub2Zmc2V0V2lkdGgpO1xuICAgICAgICBsZXQgaW5wdXRWYWx1ZU9mRWZMZXZlbCA9IG5ld0xlZnQgLyBwaW5MZXZlbExpbmUub2Zmc2V0V2lkdGggKiAxMDA7XG4gICAgICAgIGVmZmVjdFZhbHVlLnZhbHVlID0gaW5wdXRWYWx1ZU9mRWZMZXZlbDtcblxuICAgICAgICBpZiAoY3VycmVudEZpbHRlciAmJiBjdXJyZW50RmlsdGVyID09PSBcInNlcGlhXCIgfHwgY3VycmVudEZpbHRlciA9PT0gXCJncmF5c2NhbGVcIikge1xuICAgICAgICAgICAgcHJldmlld1Bob3RvLnN0eWxlLmZpbHRlciA9IGAke2N1cnJlbnRGaWx0ZXJ9KCR7Y3NzSW5kZXh9KWA7XG5cbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudEZpbHRlciAmJiBjdXJyZW50RmlsdGVyID09PSBcImludmVydFwiKSB7XG4gICAgICAgICAgICBwcmV2aWV3UGhvdG8uc3R5bGUuZmlsdGVyID0gYCR7Y3VycmVudEZpbHRlcn0oJHtjc3NJbmRleDEwMH0pYDtcblxuICAgICAgICB9XG4gICAgICAgIGlmIChjdXJyZW50RmlsdGVyICYmIGN1cnJlbnRGaWx0ZXIgPT09IFwiYmx1clwiKSB7XG4gICAgICAgICAgICBwcmV2aWV3UGhvdG8uc3R5bGUuZmlsdGVyID0gYCR7Y3VycmVudEZpbHRlcn0oJHtjc3NJbmRleFB4fSlgO1xuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGN1cnJlbnRGaWx0ZXIgJiYgY3VycmVudEZpbHRlciA9PT0gXCJicmlnaHRuZXNzXCIpIHtcbiAgICAgICAgICAgIHByZXZpZXdQaG90by5zdHlsZS5maWx0ZXIgPSBgJHtjdXJyZW50RmlsdGVyfSgke2Nzc0luZGV4QnJpZ2h0fSlgO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgY29uc3QgbW91c2VVcEhhbmRsZXIgPSAoKSA9PiB7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2VNb3ZlSGFuZGxlcik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG1vdXNlVXBIYW5kbGVyKTtcblxuICAgIH07XG5cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW91c2VNb3ZlSGFuZGxlcik7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2VVcEhhbmRsZXIpO1xuXG4gICAgcGluLm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxufVxuXG5cbnBpbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBwaW5Nb3VzZURvd25IYW5kbGVyKClcbn0pO1xuXG5lZmZlY3RzQmxvY2suYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZWZmZWN0Q2hhbmdlSGFuZGxlcik7XG5cbmNoZWNrZWRSYWRpby5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB1dGlscy5jbG9zZUVsZW1lbnQoZWZmZWN0RWxlbWVudCk7XG5cbn0pO1xuXG5zY2FsZUNvbnRyb2xQbHVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2NhbGVQbHVzQ2xpY2tIYW5kbGVyKTtcbnNjYWxlQ29udHJvbE1pbnVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2NhbGVNaW51c0NsaWNrSGFuZGxlcik7XG5cblxudXBsb2FkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uIChldnQpIHtcbiAgICB1dGlscy5vcGVuRWxlbWVudChlZGl0Rm9ybSk7XG59KTtcblxuZWRpdEZvcm1DbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldnQpIHtcbiAgICB1dGlscy5jbG9zZUVsZW1lbnQoZWRpdEZvcm0pO1xuICAgIHJlc2V0VG9EZWZhdWx0KCk7XG59KTtcblxuaWYoZWRpdEZvcm0uY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWRkZW4nKSkgcmVzZXRUb0RlZmF1bHQoKTtcblxuZXhwb3J0IHtyZXNldFRvRGVmYXVsdH1cbiIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzLmpzJ1xuXG5cbmNvbnN0IHVwbG9hZFNvY2lhbEJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tZW50cy1sb2FkZXInKTtcbmNvbnN0IGJpZ1BpY3R1cmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYmlnLXBpY3R1cmUnKTtcbmNvbnN0IGJpZ1BpY3R1cmVJbWcgPSBiaWdQaWN0dXJlLnF1ZXJ5U2VsZWN0b3IoJy5iaWctcGljdHVyZV9faW1nIGltZycpO1xuY29uc3QgYmlnUGljdHVyZUNsb3NlQnV0dG9uID0gYmlnUGljdHVyZS5xdWVyeVNlbGVjdG9yKCcuYmlnLXBpY3R1cmVfX2NhbmNlbCcpXG5jb25zdCBsaWtlc0NvdW50ID0gYmlnUGljdHVyZS5xdWVyeVNlbGVjdG9yKCcubGlrZXMtY291bnQnKTtcbmNvbnN0IHBob3RvRGlzY3JpdGlvbiA9IGJpZ1BpY3R1cmUucXVlcnlTZWxlY3RvcignLnNvY2lhbF9fY2FwdGlvbicpO1xuY29uc3QgY29tbWVudHNDb3VudCA9IGJpZ1BpY3R1cmUucXVlcnlTZWxlY3RvcignLmNvbW1lbnRzLWNvdW50Jyk7XG5jb25zdCBjb21tZW50VGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zb2NpYWxfX3RleHQnKTtcbmNvbnN0IHNvY2lhbENvbW1lbnRibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zb2NpYWxfX2NvbW1lbnQtY291bnQnKTtcbmNvbnN0IHNvY2lhbEF2YXRhciA9IGJpZ1BpY3R1cmUucXVlcnlTZWxlY3RvcignLnNvY2lhbF9fcGljdHVyZScpO1xuY29uc3QgcGljdHVyZXNDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGljdHVyZXMnKTtcbmNvbnN0IHBpY3R1cmVUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNwaWN0dXJlJylcbiAgICAuY29udGVudFxuICAgIC5xdWVyeVNlbGVjdG9yKCcucGljdHVyZScpO1xuXG5cblxuZnVuY3Rpb24gc2hvd0JpZ1BpY3R1cmUoZGF0YSkge1xuICAgIGJpZ1BpY3R1cmVJbWcuc3JjID0gZGF0YS51cmw7XG4gICAgbGlrZXNDb3VudC50ZXh0Q29udGVudCA9IGRhdGEubGlrZXM7XG4gICAgcGhvdG9EaXNjcml0aW9uLnRleHRDb250ZW50ID0gZGF0YS5kZXNjcmlwdGlvbjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbW1lbnRUZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbW1lbnRUZXh0W2ldLnRleHRDb250ZW50ID0gZGF0YS5jb21tZW50c1tpXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VQaWN0dXJlRWxlbWVudChkYXRhKSB7XG4gICAgbGV0IG5ld0VsZW1lbnQgPSBwaWN0dXJlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xuICAgIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnBpY3R1cmVfX2ltZycpLnNyYyA9IGRhdGEudXJsO1xuICAgIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnBpY3R1cmVfX2xpa2VzJykudGV4dENvbnRlbnQgPSBkYXRhLmxpa2VzO1xuICAgIG5ld0VsZW1lbnQucXVlcnlTZWxlY3RvcignLnBpY3R1cmVfX2NvbW1lbnRzJykudGV4dENvbnRlbnQgPSBkYXRhLmNvbW1lbnRzO1xuICAgIG5ld0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIHV0aWxzLm9wZW5FbGVtZW50KGJpZ1BpY3R1cmUpO1xuICAgICAgICBzaG93QmlnUGljdHVyZShkYXRhKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbmV3RWxlbWVudDtcbn07XG5cblxuZnVuY3Rpb24gcmVuZGVyUGljdHVyZUVsZW1lbnRzKGRhdGEpIHtcbiAgICBsZXQgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgZm9yIChsZXQgaXRlbSBvZiBkYXRhKSB7XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKG1ha2VQaWN0dXJlRWxlbWVudChpdGVtKSk7XG4gICAgfVxuICAgIHBpY3R1cmVzQ29udGFpbmVyLmFwcGVuZENoaWxkKGZyYWdtZW50KTtcbn1cblxuXG5cbi8vIC8vINCd0LUg0L/QvtC90Y/RgtC90L4gNSDQuNC3INCy0L7RgdGM0LzQuCDQutC+0LzQvNC10L3RgtCw0YDQuNC10LJcbi8vIGNvbW1lbnRzQ291bnQudGV4dENvbnRlbnQgPSBwaG90b0RhdGEuY29tbWVudHMubGVuZ3RoO1xuXG5cbnNvY2lhbEF2YXRhci5zcmMgPSBgaW1nL2F2YXRhci0ke01hdGguY2VpbChNYXRoLnJhbmRvbSgpICogNil9LnN2Z2A7XG5zb2NpYWxDb21tZW50YmxvY2suY2xhc3NMaXN0LmFkZCgndmlzdWFsbHktaGlkZGVuJyk7XG51cGxvYWRTb2NpYWxCdXR0b24uY2xhc3NMaXN0LmFkZCgndmlzdWFsbHktaGlkZGVuJyk7XG5cblxuYmlnUGljdHVyZUNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICB1dGlscy5jbG9zZUVsZW1lbnQoYmlnUGljdHVyZSlcbn0pXG5cblxuXG5leHBvcnQge3JlbmRlclBpY3R1cmVFbGVtZW50c31cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmNvbnN0IG51bWJlck9mT2JqZWN0cyA9IDI1O1xyXG5jb25zdCBtaW5MaWtlcyA9IDE1O1xyXG5jb25zdCBtYXhMaWtlcyA9IDIwMDtcclxuXHJcbmNvbnN0IERBVEEgPSB7XHJcbiAgICB1cmw6IFtdLFxyXG4gICAgbGlrZXM6IFtdLFxyXG4gICAgY29tbWVudHM6IFsn0JLRgdGRINC+0YLQu9C40YfQvdC+IScsICfQkiDRhtC10LvQvtC8INCy0YHRkSDQvdC10L/Qu9C+0YXQvi4g0J3QviDQvdC1INCy0YHRkScsICfQmtC+0LPQtNCwINCy0Ysg0LTQtdC70LDQtdGC0LUg0YTQvtGC0L7Qs9GA0LDRhNC40Y4sINGF0L7RgNC+0YjQviDQsdGLINGD0LHQuNGA0LDRgtGMINC/0LDQu9C10YYg0LjQtyDQutCw0LTRgNCwJywgJ9CSINC60L7QvdGG0LUg0LrQvtC90YbQvtCyINGN0YLQviDQv9GA0L7RgdGC0L4g0L3QtdC/0YDQvtGE0LXRgdGB0LjQvtC90LDQu9GM0L3QvicsICfQnNC+0Y8g0LHQsNCx0YPRiNC60LAg0YHQu9GD0YfQsNC50L3QviDRh9C40YXQvdGD0LvQsCDRgSDRhNC+0YLQvtCw0L/Qv9Cw0YDQsNGC0L7QvCDQsiDRgNGD0LrQsNGFINC4INGDINC90LXRkSDQv9C+0LvRg9GH0LjQu9Cw0YHRjCDRhNC+0YLQvtCz0YDQsNGE0LjRjyDQu9GD0YfRiNC1JywgJ9CvINC/0L7RgdC60L7Qu9GM0LfQvdGD0LvRgdGPINC90LAg0LHQsNC90LDQvdC+0LLQvtC5INC60L7QttGD0YDQtSDQuCDRg9GA0L7QvdC40Lsg0YTQvtGC0L7QsNC/0L/QsNGA0LDRgiDQvdCwINC60L7RgtCwINC4INGDINC80LXQvdGPINC/0L7Qu9GD0YfQuNC70LDRgdGMINGE0L7RgtC+0LPRgNCw0YTQuNGPINC70YPRh9GI0LUnLCAn0JvQuNGG0LAg0YMg0LvRjtC00LXQuSDQvdCwINGE0L7RgtC60LUg0L/QtdGA0LXQutC+0YjQtdC90YssINC60LDQuiDQsdGD0LTRgtC+INC40YUg0LjQt9Cx0LjQstCw0Y7RgicsICfQmtCw0Log0LzQvtC20L3QviDQsdGL0LvQviDQv9C+0LnQvNCw0YLRjCDRgtCw0LrQvtC5INC90LXRg9C00LDRh9C90YvQuSDQvNC+0LzQtdC90YI/ISddLFxyXG4gICAgZGVzY3JpcHRpb246IFsn0KLQtdGB0YLQuNC8INC90L7QstGD0Y4g0LrQsNC80LXRgNGDIScsICfQl9Cw0YLRg9GB0LjQu9C4INGBINC00YDRg9C30YzRj9C80Lgg0L3QsCDQvNC+0YDQtScsICfQmtCw0Log0LbQtSDQutGA0YPRgtC+INGC0YPRgiDQutC+0YDQvNGP0YInLCAn0J7RgtC00YvRhdCw0LXQvC4uLicsICfQptC10L3QuNGC0LUg0LrQsNC20LTQvtC1INC80LPQvdC+0LLQtdC90YzQtS4nLCAn0KbQtdC90LjRgtC1INGC0LXRhSwg0LrRgtC+INGA0Y/QtNC+0Lwg0YEg0LLQsNC80Lgg0Lgg0L7RgtCz0L7QvdGP0LnRgtC1INCy0YHQtSDRgdC+0LzQvdC10L3RjNGPLicsICfQndC1INC+0LHQuNC20LDQudGC0LUg0LLRgdC10YUg0YHQu9C+0LLQsNC80LguLi4uLi4nLCAn0JLQvtGCINGN0YLQviDRgtCw0YfQutCwISddLFxyXG59O1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IG51bWJlck9mT2JqZWN0czsgaSsrKSB7XHJcbiAgICAgICAgREFUQS51cmwucHVzaChgcGhvdG9zLyR7aX0uanBnYCk7XHJcbiAgICB9XHJcbn0pKCk7XHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gbWluTGlrZXM7IGkgPD0gbWF4TGlrZXM7IGkrKykge1xyXG4gICAgICAgIERBVEEubGlrZXMucHVzaChpKTtcclxuXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1heCkge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heCk7XHJcbn1cclxuXHJcbmNvbnN0IHBob3RvRGF0YSA9IFtdO1xyXG5cclxuXHJcbmZ1bmN0aW9uIG1ha2VQaG90b0RhdGFPYmooZGF0YSwgY29udGFpbmVyLCB0b3RhbE9iaikge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3RhbE9iajsgaSsrKSB7XHJcbiAgICAgICAgbGV0IG9iaiA9IHt9O1xyXG4gICAgICAgIGZvciAobGV0IGRhdGFLZXkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICBsZXQgcmFuZG9tTnVtYmVyID0gZ2V0UmFuZG9tSW50KGRhdGFbZGF0YUtleV0ubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIGlmIChkYXRhS2V5ID09PSAndXJsJykge1xyXG4gICAgICAgICAgICAgICAgb2JqW2RhdGFLZXldID0gZGF0YVtkYXRhS2V5XVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGF0YUtleSA9PT0gJ2NvbW1lbnRzJykge1xyXG4gICAgICAgICAgICAgICAgb2JqW2RhdGFLZXldID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtkYXRhS2V5XS5wdXNoKGRhdGFbZGF0YUtleV1bZ2V0UmFuZG9tSW50KGRhdGFbZGF0YUtleV0ubGVuZ3RoIC0gMSldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZGF0YUtleSAhPT0gJ3VybE51bWJlcnMnICYmIGRhdGFLZXkgIT09ICdsaWtlc051bWJlcnMnICYmIGRhdGFLZXkgIT09ICd1cmwnICYmIGRhdGFLZXkgIT09ICdjb21tZW50cycpIHtcclxuICAgICAgICAgICAgICAgIG9ialtkYXRhS2V5XSA9IGRhdGFbZGF0YUtleV1bcmFuZG9tTnVtYmVyXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb250YWluZXIucHVzaChvYmopO1xyXG4gICAgfVxyXG59XHJcblxyXG5tYWtlUGhvdG9EYXRhT2JqKERBVEEsIHBob3RvRGF0YSwgbnVtYmVyT2ZPYmplY3RzKTtcclxuXHJcblxyXG5leHBvcnQge3Bob3RvRGF0YX07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzLmpzJ1xuXG5jb25zdCB1cGxvYWRTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmltZy11cGxvYWQnKTtcbmNvbnN0IGhhc2hUYWcgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0X19oYXNodGFncycpO1xuY29uc3QgdGV4dEFyZWEgPSB1cGxvYWRTZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0X19kZXNjcmlwdGlvbicpO1xuY29uc3Qgc3VibWl0QnV0dG9uID0gdXBsb2FkU2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcuaW1nLXVwbG9hZF9fc3VibWl0Jyk7XG5cbmNvbnN0IGhhc2hUYWdWYWxpZGF0ZUhhbmRsZXIgPSAoZWxlbWVudCkgPT4ge1xuXG4gICAgbGV0IHJlZ0V4cCA9IC8oI1teI1xcc117MSwxOX0pL2c7XG4gICAgbGV0IHN0ciA9IGVsZW1lbnQudmFsdWU7XG4gICAgbGV0IGFyciA9IHN0ci5tYXRjaChyZWdFeHApO1xuICAgIGxldCBpc1RydWUgPSAocmVnRXhwLCBzdHIpID0+IHJlZ0V4cC50ZXN0KHN0cik7XG5cbiAgICBpZiAoaXNUcnVlKC8oPzwhXFx3KSMoPyFcXHcpLywgc3RyKSkge1xuICAgICAgICBlbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KCfQpdC10Ygt0YLQtdCzINC90LUg0LzQvtC20LXRgiDRgdC+0YHRgtC+0Y/RgtGMINGC0L7Qu9GM0LrQviDQuNC3INC+0LTQvdC+0Lkg0YDQtdGI0ZHRgtC60LgnKTtcbiAgICAgICAgZWxlbWVudC5yZXBvcnRWYWxpZGl0eSgpO1xuICAgICAgICBlbGVtZW50LnN0eWxlLm91dGxpbmUgPSAnM3B4IHNvbGlkIHJlZCc7XG5cblxuICAgIH0gZWxzZSBpZiAoaXNUcnVlKC9bXiNcXHdcXHNdezEsfSg/PS4qKXwoKD88ISMpKFxcYlxcd3sxLDE5fVxcYiA/KXsxLDV9KS8sIHN0cikpIHtcbiAgICAgICAgZWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eSgn0KXQtdGILdGC0LXQsyDQvdCw0YfQuNC90LDQtdGC0YHRjyBjINGA0LXRiNC10YLRiNC60LgnKTtcbiAgICAgICAgZWxlbWVudC5yZXBvcnRWYWxpZGl0eSgpO1xuICAgICAgICBlbGVtZW50LnN0eWxlLm91dGxpbmUgPSAnM3B4IHNvbGlkIHJlZCc7XG5cbiAgICB9IGVsc2UgaWYgKGlzVHJ1ZSgvKCNcXHd7MSwxOX0jXFx3Kil7MSw1fS8sIHN0cikpIHtcbiAgICAgICAgZWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eSgn0KXRjdGILdGC0LXQs9C4INGA0LDQt9C00LXQu9GP0Y7RgtGB0Y8g0L/RgNC+0LHQtdC70LDQvNC4Jyk7XG4gICAgICAgIGVsZW1lbnQucmVwb3J0VmFsaWRpdHkoKTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gJzNweCBzb2xpZCByZWQnO1xuICAgIH0gZWxzZSBpZiAoaXNUcnVlKC8oKD88PVxccykjKD8hXFx3KSkvLCBzdHIpKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzc2QnKTtcbiAgICAgICAgZWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eSgn0KXQtdGILdGC0LXQsyDQvdC1INC80L7QttC10YIg0YHQvtGB0YLQvtGP0YLRjCDRgtC+0LvRjNC60L4g0LjQtyDQvtC00L3QvtC5INGA0LXRiNGR0YLQutC4OycpO1xuICAgICAgICBlbGVtZW50LnJlcG9ydFZhbGlkaXR5KCk7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3V0bGluZSA9ICczcHggc29saWQgcmVkJztcbiAgICB9IGVsc2UgaWYgKGlzVHJ1ZSgvKCNbXiNcXHNdezEsMTl9ID8pezYsfS8sIHN0cikpIHtcbiAgICAgICAgZWxlbWVudC5zZXRDdXN0b21WYWxpZGl0eSgn0J3QtdC70YzQt9GPINGD0LrQsNC30LDRgtGMINCx0L7Qu9GM0YjQtSDQv9GP0YLQuCDRhdGN0Ygt0YLQtdCz0L7QsicpO1xuICAgICAgICBlbGVtZW50LnJlcG9ydFZhbGlkaXR5KCk7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3V0bGluZSA9ICczcHggc29saWQgcmVkJztcbiAgICB9IGVsc2UgaWYgKGlzVHJ1ZSgvKCNbXiNcXHNdezIwLH0gPykvLCBzdHIpKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkoJ9Cc0LDQutGB0LjQvNCw0LvRjNC90LDRjyDQtNC70LjQvdCwINC+0LTQvdC+0LPQviDRhdGN0Ygt0YLQtdCz0LAg0LzQvtC20LXRgiDQsdGL0YLRjCAyMCDRgdC40LzQstC+0LvQvtCyLCDQstC60LvRjtGH0LDRjyDRgNC10YjRkdGC0LrRgycpO1xuICAgICAgICBlbGVtZW50LnJlcG9ydFZhbGlkaXR5KCk7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3V0bGluZSA9ICczcHggc29saWQgcmVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KCcnKTtcbiAgICAgICAgZWxlbWVudC5yZXBvcnRWYWxpZGl0eSgpO1xuICAgICAgICBlbGVtZW50LnN0eWxlLm91dGxpbmUgPSAnJztcbiAgICB9XG4gICAgaWYgKGFycikge1xuICAgICAgICBsZXQgcmVzdWx0ID0gYXJyLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5zcGxpdCgnLCcpO1xuICAgICAgICBmb3IgKGxldCBpdGVtIG9mIHJlc3VsdCkge1xuICAgICAgICAgICAgbGV0IHNpbWlsaWFyID0gMDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzdWx0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT09IHJlc3VsdFtpXSkge1xuICAgICAgICAgICAgICAgICAgICBzaW1pbGlhcisrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNpbWlsaWFyID4gMSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkoJ9Ce0LTQuNC9INC4INGC0L7RgiDQttC1INGF0Y3RiC3RgtC10LMg0L3QtSDQvNC+0LbQtdGCINCx0YvRgtGMINC40YHQv9C+0LvRjNC30L7QstCw0L0g0LTQstCw0LbQtNGLJyk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5yZXBvcnRWYWxpZGl0eSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3V0bGluZSA9ICczcHggc29saWQgcmVkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG59O1xuXG5cbmNvbnN0IHRleHRBcmVhVmFsaWRhdGVIYW5kbGVyID0gKGVsZW1lbnQpID0+IHtcbiAgICBpZiAoZWxlbWVudC52YWxpZGl0eS50b29Mb25nKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0Q3VzdG9tVmFsaWRpdHkoJ9C00LvQuNC90LAg0LrQvtC80LzQtdC90YLQsNGA0LjRjyDQvdC1INC80L7QttC10YIg0YHQvtGB0YLQsNCy0LvRj9GC0Ywg0LHQvtC70YzRiNC1IDE0MCDRgdC40LzQstC+0LvQvtCyJyk7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3V0bGluZSA9ICczcHggc29saWQgcmVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LnNldEN1c3RvbVZhbGlkaXR5KCcnKTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vdXRsaW5lID0gJyc7XG4gICAgfVxuXG59O1xuXG5zdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgaGFzaFRhZ1ZhbGlkYXRlSGFuZGxlcihoYXNoVGFnKTtcbiAgICB0ZXh0QXJlYVZhbGlkYXRlSGFuZGxlcih0ZXh0QXJlYSk7XG59KTtcblxuaGFzaFRhZy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24gKGV2dCkge1xuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcbn0pXG5cbnRleHRBcmVhLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xufSlcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmltcG9ydCB7cmVzZXRUb0RlZmF1bHR9IGZyb20gICcuL3BpY3R1cmUtZWZmZWN0cy5qcydcbmltcG9ydCB7cmVuZGVyUGljdHVyZUVsZW1lbnRzfSBmcm9tICcuL3BpY3R1cmVzLmpzJztcbmltcG9ydCB7cGhvdG9EYXRhfSBmcm9tICcuL3JlbmRlci1yYW5kb20tZGF0YS5qcydcbmltcG9ydCAnLi9waWN0dXJlLWVmZmVjdHMuanMnXG5pbXBvcnQgJy4vZm9ybS12YWxpZGF0aW9uLmpzJ1xuXG5yZW5kZXJQaWN0dXJlRWxlbWVudHMocGhvdG9EYXRhKTtcblxuXG5cbiJdLCJuYW1lcyI6WyJlc2NFdmVudENvZGUiLCJlbGVtZW50VG9DbG9zZSIsImlzRXNjUHJlc3NlZCIsImV2dCIsImNvZGUiLCJlc2NQcmVzc0hhbmRsZXIiLCJjbG9zZUVsZW1lbnQiLCJyZXNldFRvRGVmYXVsdCIsIm9wZW5FbGVtZW50IiwiZWxlbWVudCIsImNsYXNzTGlzdCIsInJlbW92ZSIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ1cGxvYWRTZWN0aW9uIiwicXVlcnlTZWxlY3RvciIsInVwbG9hZEJ1dHRvbiIsImZvcm0iLCJlZGl0Rm9ybSIsImVkaXRGb3JtQ2xvc2VCdXR0b24iLCJwcmV2aWV3UGhvdG8iLCJzY2FsZUNvbnRyb2xNaW51cyIsInNjYWxlQ29udHJvbFBsdXMiLCJzY2FsZUNvbnRyb2xJbnB1dCIsImVmZmVjdEVsZW1lbnQiLCJlZmZlY3RWYWx1ZSIsImVmZmVjdHNCbG9jayIsImNoZWNrZWRSYWRpbyIsImVmZmVjdERlcHRoIiwicGluTGV2ZWxMaW5lIiwicGluIiwiY2xpY2tlZENsYXNzIiwiY2xpY2tlZE5vZGUiLCJjdXJyZW50RmlsdGVyIiwidmFsdWUiLCJ1dGlscyIsInNjYWxlTWludXNDbGlja0hhbmRsZXIiLCJzY2FsZVN0ZXAiLCJzY2FsZVZhbHVlIiwicGFyc2VJbnQiLCJjc3NTY2FsZUluZGV4Iiwic3R5bGUiLCJ0cmFuc2Zvcm0iLCJzY2FsZVBsdXNDbGlja0hhbmRsZXIiLCJtYXhTY2FsZSIsImVmZmVjdENoYW5nZUhhbmRsZXIiLCJ0YXJnZXQiLCJkYXRhc2V0IiwiZmlsdGVyIiwibGVmdCIsIndpZHRoIiwicGluTW91c2VEb3duSGFuZGxlciIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzaGlmdFgiLCJjbGllbnRYIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibW91c2VNb3ZlSGFuZGxlciIsIm5ld0xlZnQiLCJyaWdodEVkZ2UiLCJvZmZzZXRXaWR0aCIsImNzc0luZGV4IiwiY3NzSW5kZXhQeCIsImNzc0luZGV4MTAwIiwiY3NzSW5kZXhCcmlnaHQiLCJpbnB1dFZhbHVlT2ZFZkxldmVsIiwibW91c2VVcEhhbmRsZXIiLCJvbmRyYWdzdGFydCIsImNvbnRhaW5zIiwidXBsb2FkU29jaWFsQnV0dG9uIiwiYmlnUGljdHVyZSIsImJpZ1BpY3R1cmVJbWciLCJiaWdQaWN0dXJlQ2xvc2VCdXR0b24iLCJsaWtlc0NvdW50IiwicGhvdG9EaXNjcml0aW9uIiwiY29tbWVudHNDb3VudCIsImNvbW1lbnRUZXh0IiwicXVlcnlTZWxlY3RvckFsbCIsInNvY2lhbENvbW1lbnRibG9jayIsInNvY2lhbEF2YXRhciIsInBpY3R1cmVzQ29udGFpbmVyIiwicGljdHVyZVRlbXBsYXRlIiwiY29udGVudCIsInNob3dCaWdQaWN0dXJlIiwiZGF0YSIsInNyYyIsInVybCIsInRleHRDb250ZW50IiwibGlrZXMiLCJkZXNjcmlwdGlvbiIsImkiLCJsZW5ndGgiLCJjb21tZW50cyIsIm1ha2VQaWN0dXJlRWxlbWVudCIsIm5ld0VsZW1lbnQiLCJjbG9uZU5vZGUiLCJyZW5kZXJQaWN0dXJlRWxlbWVudHMiLCJmcmFnbWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJpdGVtIiwiYXBwZW5kQ2hpbGQiLCJNYXRoIiwiY2VpbCIsInJhbmRvbSIsIm51bWJlck9mT2JqZWN0cyIsIm1pbkxpa2VzIiwibWF4TGlrZXMiLCJEQVRBIiwicHVzaCIsImdldFJhbmRvbUludCIsIm1heCIsImZsb29yIiwicGhvdG9EYXRhIiwibWFrZVBob3RvRGF0YU9iaiIsImNvbnRhaW5lciIsInRvdGFsT2JqIiwib2JqIiwiZGF0YUtleSIsInJhbmRvbU51bWJlciIsImhhc2hUYWciLCJ0ZXh0QXJlYSIsInN1Ym1pdEJ1dHRvbiIsImhhc2hUYWdWYWxpZGF0ZUhhbmRsZXIiLCJyZWdFeHAiLCJzdHIiLCJhcnIiLCJtYXRjaCIsImlzVHJ1ZSIsInRlc3QiLCJzZXRDdXN0b21WYWxpZGl0eSIsInJlcG9ydFZhbGlkaXR5Iiwib3V0bGluZSIsImNvbnNvbGUiLCJsb2ciLCJyZXN1bHQiLCJ0b1N0cmluZyIsInRvTG93ZXJDYXNlIiwic3BsaXQiLCJzaW1pbGlhciIsInRleHRBcmVhVmFsaWRhdGVIYW5kbGVyIiwidmFsaWRpdHkiLCJ0b29Mb25nIiwic3RvcFByb3BhZ2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7SUFNQSxNQUFNQSxZQUFZLEdBQUcsUUFBckI7SUFDQSxJQUFJQyxjQUFKOztJQUVBLE1BQU1DLFlBQVksR0FBR0MsR0FBRyxJQUFJQSxHQUFHLENBQUNDLElBQUosS0FBYUosWUFBekM7O0lBS0EsTUFBTUssZUFBZSxHQUFJRixHQUFELElBQVM7SUFDN0IsTUFBSUQsWUFBWSxDQUFDQyxHQUFELENBQWhCLEVBQXVCO0lBQ25CRyxJQUFBQSxZQUFZLENBQUNMLGNBQUQsQ0FBWjtJQUNBTSxJQUFBQSxjQUFjO0lBQ2pCO0lBQ0osQ0FMRDs7SUFPQSxNQUFNQyxXQUFXLEdBQUlDLE9BQUQsSUFBYTtJQUM3QkEsRUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQWtCQyxNQUFsQixDQUF5QixRQUF6QjtJQUNBVixFQUFBQSxjQUFjLEdBQUdRLE9BQWpCO0lBQ0FHLEVBQUFBLFFBQVEsQ0FBQ0MsZ0JBQVQsQ0FBMEIsU0FBMUIsRUFBcUNSLGVBQXJDO0lBQ0gsQ0FKRDs7SUFNQSxNQUFNQyxZQUFZLEdBQUlHLE9BQUQsSUFBYTtJQUM5QkEsRUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQWtCSSxHQUFsQixDQUFzQixRQUF0QjtJQUNBRixFQUFBQSxRQUFRLENBQUNHLG1CQUFULENBQTZCLFNBQTdCLEVBQXdDVixlQUF4QztJQUNILENBSEQ7O0lDckJBLE1BQU1XLGFBQWEsR0FBR0osUUFBUSxDQUFDSyxhQUFULENBQXVCLGFBQXZCLENBQXRCO0lBQ0EsTUFBTUMsWUFBWSxHQUFHRixhQUFhLENBQUNDLGFBQWQsQ0FBNEIsY0FBNUIsQ0FBckI7SUFDQSxNQUFNRSxJQUFJLEdBQUdILGFBQWEsQ0FBQ0MsYUFBZCxDQUE0QixNQUE1QixDQUFiO0lBQ0EsTUFBTUcsUUFBUSxHQUFHSixhQUFhLENBQUNDLGFBQWQsQ0FBNEIsc0JBQTVCLENBQWpCO0lBQ0EsTUFBTUksbUJBQW1CLEdBQUdMLGFBQWEsQ0FBQ0MsYUFBZCxDQUE0QixxQkFBNUIsQ0FBNUI7SUFDQSxNQUFNSyxZQUFZLEdBQUdOLGFBQWEsQ0FBQ0MsYUFBZCxDQUE0QixzQkFBNUIsQ0FBckI7SUFDQSxNQUFNTSxpQkFBaUIsR0FBR1AsYUFBYSxDQUFDQyxhQUFkLENBQTRCLDBCQUE1QixDQUExQjtJQUNBLE1BQU1PLGdCQUFnQixHQUFHUixhQUFhLENBQUNDLGFBQWQsQ0FBNEIseUJBQTVCLENBQXpCO0lBQ0EsTUFBTVEsaUJBQWlCLEdBQUdULGFBQWEsQ0FBQ0MsYUFBZCxDQUE0Qix3QkFBNUIsQ0FBMUI7SUFDQSxNQUFNUyxhQUFhLEdBQUdWLGFBQWEsQ0FBQ0MsYUFBZCxDQUE0QixlQUE1QixDQUF0QjtJQUNBLE1BQU1VLFdBQVcsR0FBR1gsYUFBYSxDQUFDQyxhQUFkLENBQTRCLHNCQUE1QixDQUFwQjtJQUNBLE1BQU1XLFlBQVksR0FBR1osYUFBYSxDQUFDQyxhQUFkLENBQTRCLGdCQUE1QixDQUFyQjtJQUNBLE1BQU1ZLFlBQVksR0FBR2IsYUFBYSxDQUFDQyxhQUFkLENBQTRCLGdCQUE1QixDQUFyQjtJQUNBLE1BQU1hLFdBQVcsR0FBR2QsYUFBYSxDQUFDQyxhQUFkLENBQTRCLHNCQUE1QixDQUFwQjtJQUNBLE1BQU1jLFlBQVksR0FBR25CLFFBQVEsQ0FBQ0ssYUFBVCxDQUF1QixxQkFBdkIsQ0FBckI7SUFDQSxNQUFNZSxHQUFHLEdBQUdoQixhQUFhLENBQUNDLGFBQWQsQ0FBNEIsb0JBQTVCLENBQVo7SUFHQSxJQUFJZ0IsWUFBSjtJQUNBLElBQUlDLFdBQUo7SUFDQSxJQUFJQyxhQUFKO0lBSUFSLFdBQVcsQ0FBQ1MsS0FBWixHQUFvQixDQUFwQjtJQUNBWCxpQkFBaUIsQ0FBQ1csS0FBbEIsR0FBMEIsTUFBMUI7QUFDQUMsZ0JBQUEsQ0FBbUJYLGFBQW5COztJQUlBLE1BQU1ZLHNCQUFzQixHQUFHLE1BQU07SUFDakMsTUFBSUMsU0FBUyxHQUFHLEVBQWhCO0lBQ0EsTUFBSUMsVUFBVSxHQUFHQyxRQUFRLENBQUNoQixpQkFBaUIsQ0FBQ1csS0FBbkIsQ0FBekI7SUFDQSxNQUFJSSxVQUFVLEdBQUdELFNBQWpCLEVBQTRCZCxpQkFBaUIsQ0FBQ1csS0FBbEIsR0FBMkJJLFVBQVUsR0FBR0QsU0FBZCxHQUEyQixHQUFyRDtJQUM1QixNQUFJRyxhQUFhLEdBQUdELFFBQVEsQ0FBQ2hCLGlCQUFpQixDQUFDVyxLQUFuQixDQUFSLEdBQW9DLEdBQXhEO0lBQ0FkLEVBQUFBLFlBQVksQ0FBQ3FCLEtBQWIsQ0FBbUJDLFNBQW5CLEdBQWdDLFNBQVFGLGFBQWMsR0FBdEQ7SUFFSCxDQVBEOztJQVNBLE1BQU1HLHFCQUFxQixHQUFHLE1BQU07SUFDaEMsTUFBSU4sU0FBUyxHQUFHLEVBQWhCO0lBQ0EsTUFBSU8sUUFBUSxHQUFHLEdBQWY7SUFDQSxNQUFJTixVQUFVLEdBQUdDLFFBQVEsQ0FBQ2hCLGlCQUFpQixDQUFDVyxLQUFuQixDQUF6QjtJQUNBLE1BQUlJLFVBQVUsR0FBR00sUUFBakIsRUFBMkJyQixpQkFBaUIsQ0FBQ1csS0FBbEIsR0FBMkJJLFVBQVUsR0FBR0QsU0FBZCxHQUEyQixHQUFyRDtJQUMzQixNQUFJRyxhQUFhLEdBQUdELFFBQVEsQ0FBQ2hCLGlCQUFpQixDQUFDVyxLQUFuQixDQUFSLEdBQW9DLEdBQXhEO0lBQ0FkLEVBQUFBLFlBQVksQ0FBQ3FCLEtBQWIsQ0FBbUJDLFNBQW5CLEdBQWdDLFNBQVFGLGFBQWMsR0FBdEQ7SUFDSCxDQVBEOztJQVdBLE1BQU1LLG1CQUFtQixHQUFJNUMsR0FBRCxJQUFTO0lBQ2pDK0IsRUFBQUEsV0FBVyxHQUFHL0IsR0FBRyxDQUFDNkMsTUFBbEI7SUFDQWIsRUFBQUEsYUFBYSxHQUFHRCxXQUFXLENBQUNlLE9BQVosQ0FBb0JDLE1BQXBDO0lBQ0FqQixFQUFBQSxZQUFZLEdBQUkscUJBQW9COUIsR0FBRyxDQUFDNkMsTUFBSixDQUFXWixLQUFNLEVBQXJEO0lBQ0FkLEVBQUFBLFlBQVksQ0FBQ1osU0FBYixDQUF1QkksR0FBdkIsQ0FBNEIscUJBQW9CWCxHQUFHLENBQUM2QyxNQUFKLENBQVdaLEtBQU0sRUFBakU7SUFDQTdCLEVBQUFBLGNBQWM7SUFDakIsQ0FORDs7SUFTQSxNQUFNQSxjQUFjLEdBQUcsTUFBTTtJQUN6QixNQUFJMEIsWUFBSixFQUFrQlgsWUFBWSxDQUFDWixTQUFiLENBQXVCQyxNQUF2QixDQUE4QnNCLFlBQTlCO0lBQ2xCLE1BQUlFLGFBQUosRUFBbUJiLFlBQVksQ0FBQ3FCLEtBQWIsQ0FBbUJPLE1BQW5CLEdBQTRCLEVBQTVCOztJQUNuQixNQUFJaEIsV0FBVyxJQUFJQSxXQUFXLENBQUNFLEtBQVosS0FBc0IsTUFBekMsRUFBaUQ7SUFDN0NWLElBQUFBLGFBQWEsQ0FBQ2hCLFNBQWQsQ0FBd0JDLE1BQXhCLENBQStCLFFBQS9CO0lBQ0g7O0lBQ0RxQixFQUFBQSxHQUFHLENBQUNXLEtBQUosQ0FBVVEsSUFBVixHQUFpQixNQUFqQjtJQUNBckIsRUFBQUEsV0FBVyxDQUFDYSxLQUFaLENBQWtCUyxLQUFsQixHQUEwQixNQUExQjtJQUNBekIsRUFBQUEsV0FBVyxDQUFDUyxLQUFaLEdBQW9CLEdBQXBCO0lBQ0FkLEVBQUFBLFlBQVksQ0FBQ3FCLEtBQWIsQ0FBbUJDLFNBQW5CLEdBQStCLFVBQS9CO0lBQ0FuQixFQUFBQSxpQkFBaUIsQ0FBQ1csS0FBbEIsR0FBMEIsTUFBMUI7SUFDSCxDQVhEOztJQWFBLE1BQU1pQixtQkFBbUIsR0FBRyxNQUFJO0lBRTVCQyxFQUFBQSxLQUFLLENBQUNDLGNBQU47SUFDQSxNQUFJQyxNQUFNLEdBQUdGLEtBQUssQ0FBQ0csT0FBTixHQUFnQnpCLEdBQUcsQ0FBQzBCLHFCQUFKLEdBQTRCUCxJQUF6RDs7SUFHQSxRQUFNUSxnQkFBZ0IsR0FBSUwsS0FBRCxJQUFXO0lBQ2hDQSxJQUFBQSxLQUFLLENBQUNDLGNBQU47SUFDQSxRQUFJSyxPQUFPLEdBQUdOLEtBQUssQ0FBQ0csT0FBTixHQUFnQkQsTUFBaEIsR0FBeUJ6QixZQUFZLENBQUMyQixxQkFBYixHQUFxQ1AsSUFBNUU7O0lBRUEsUUFBSVMsT0FBTyxHQUFHLENBQWQsRUFBaUI7SUFDYkEsTUFBQUEsT0FBTyxHQUFHLENBQVY7SUFDSDs7SUFDRCxRQUFJQyxTQUFTLEdBQUc5QixZQUFZLENBQUMrQixXQUE3Qjs7SUFDQSxRQUFJRixPQUFPLEdBQUdDLFNBQWQsRUFBeUI7SUFDckJELE1BQUFBLE9BQU8sR0FBR0MsU0FBVjtJQUNIOztJQUVEN0IsSUFBQUEsR0FBRyxDQUFDVyxLQUFKLENBQVVRLElBQVYsR0FBaUJTLE9BQU8sR0FBRyxJQUEzQjtJQUNBOUIsSUFBQUEsV0FBVyxDQUFDYSxLQUFaLENBQWtCUyxLQUFsQixHQUEwQlEsT0FBTyxHQUFHLElBQXBDO0lBR0EsUUFBSUcsUUFBUSxHQUFHSCxPQUFPLEdBQUc3QixZQUFZLENBQUMrQixXQUF0QztJQUNBLFFBQUlFLFVBQVUsR0FBR0osT0FBTyxHQUFHLENBQVYsR0FBYzdCLFlBQVksQ0FBQytCLFdBQTNCLEdBQXlDLElBQTFEO0lBQ0EsUUFBSUcsV0FBVyxHQUFHTCxPQUFPLEdBQUc3QixZQUFZLENBQUMrQixXQUF2QixHQUFxQyxHQUFyQyxHQUEyQyxHQUE3RDtJQUNBLFFBQUlJLGNBQWMsR0FBRyxJQUFLLElBQUlOLE9BQUosR0FBYzdCLFlBQVksQ0FBQytCLFdBQXJEO0lBQ0EsUUFBSUssbUJBQW1CLEdBQUdQLE9BQU8sR0FBRzdCLFlBQVksQ0FBQytCLFdBQXZCLEdBQXFDLEdBQS9EO0lBQ0FuQyxJQUFBQSxXQUFXLENBQUNTLEtBQVosR0FBb0IrQixtQkFBcEI7O0lBRUEsUUFBSWhDLGFBQWEsSUFBSUEsYUFBYSxLQUFLLE9BQW5DLElBQThDQSxhQUFhLEtBQUssV0FBcEUsRUFBaUY7SUFDN0ViLE1BQUFBLFlBQVksQ0FBQ3FCLEtBQWIsQ0FBbUJPLE1BQW5CLEdBQTZCLEdBQUVmLGFBQWMsSUFBRzRCLFFBQVMsR0FBekQ7SUFFSDs7SUFDRCxRQUFJNUIsYUFBYSxJQUFJQSxhQUFhLEtBQUssUUFBdkMsRUFBaUQ7SUFDN0NiLE1BQUFBLFlBQVksQ0FBQ3FCLEtBQWIsQ0FBbUJPLE1BQW5CLEdBQTZCLEdBQUVmLGFBQWMsSUFBRzhCLFdBQVksR0FBNUQ7SUFFSDs7SUFDRCxRQUFJOUIsYUFBYSxJQUFJQSxhQUFhLEtBQUssTUFBdkMsRUFBK0M7SUFDM0NiLE1BQUFBLFlBQVksQ0FBQ3FCLEtBQWIsQ0FBbUJPLE1BQW5CLEdBQTZCLEdBQUVmLGFBQWMsSUFBRzZCLFVBQVcsR0FBM0Q7SUFFSDs7SUFDRCxRQUFJN0IsYUFBYSxJQUFJQSxhQUFhLEtBQUssWUFBdkMsRUFBcUQ7SUFDakRiLE1BQUFBLFlBQVksQ0FBQ3FCLEtBQWIsQ0FBbUJPLE1BQW5CLEdBQTZCLEdBQUVmLGFBQWMsSUFBRytCLGNBQWUsR0FBL0Q7SUFDSDtJQUNKLEdBdENEOztJQXlDQSxRQUFNRSxjQUFjLEdBQUcsTUFBTTtJQUN6QnhELElBQUFBLFFBQVEsQ0FBQ0csbUJBQVQsQ0FBNkIsV0FBN0IsRUFBMEM0QyxnQkFBMUM7SUFDQS9DLElBQUFBLFFBQVEsQ0FBQ0csbUJBQVQsQ0FBNkIsU0FBN0IsRUFBd0NxRCxjQUF4QztJQUVILEdBSkQ7O0lBT0F4RCxFQUFBQSxRQUFRLENBQUNDLGdCQUFULENBQTBCLFdBQTFCLEVBQXVDOEMsZ0JBQXZDO0lBQ0EvQyxFQUFBQSxRQUFRLENBQUNDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDdUQsY0FBckM7O0lBRUFwQyxFQUFBQSxHQUFHLENBQUNxQyxXQUFKLEdBQWtCLFlBQVk7SUFDMUIsV0FBTyxLQUFQO0lBQ0gsR0FGRDtJQUlILENBN0REOztJQWdFQXJDLEdBQUcsQ0FBQ25CLGdCQUFKLENBQXFCLFdBQXJCLEVBQWtDLFVBQVV5QyxLQUFWLEVBQWlCO0lBQy9DRCxFQUFBQSxtQkFBbUI7SUFDdEIsQ0FGRDtJQUlBekIsWUFBWSxDQUFDZixnQkFBYixDQUE4QixRQUE5QixFQUF3Q2tDLG1CQUF4QztJQUVBbEIsWUFBWSxDQUFDaEIsZ0JBQWIsQ0FBOEIsT0FBOUIsRUFBdUMsWUFBWTtJQUMvQ3dCLEVBQUFBLFlBQUEsQ0FBbUJYLGFBQW5CO0lBRUgsQ0FIRDtJQUtBRixnQkFBZ0IsQ0FBQ1gsZ0JBQWpCLENBQWtDLE9BQWxDLEVBQTJDZ0MscUJBQTNDO0lBQ0F0QixpQkFBaUIsQ0FBQ1YsZ0JBQWxCLENBQW1DLE9BQW5DLEVBQTRDeUIsc0JBQTVDO0lBR0FwQixZQUFZLENBQUNMLGdCQUFiLENBQThCLFFBQTlCLEVBQXdDLFVBQVVWLEdBQVYsRUFBZTtJQUNuRGtDLEVBQUFBLFdBQUEsQ0FBa0JqQixRQUFsQjtJQUNILENBRkQ7SUFJQUMsbUJBQW1CLENBQUNSLGdCQUFwQixDQUFxQyxPQUFyQyxFQUE4QyxVQUFVVixHQUFWLEVBQWU7SUFDekRrQyxFQUFBQSxZQUFBLENBQW1CakIsUUFBbkI7SUFDQWIsRUFBQUEsY0FBYztJQUNqQixDQUhEO0lBS0EsSUFBR2EsUUFBUSxDQUFDVixTQUFULENBQW1CNEQsUUFBbkIsQ0FBNEIsUUFBNUIsQ0FBSCxFQUEwQy9ELGNBQWM7O0lDakt4RCxNQUFNZ0Usa0JBQWtCLEdBQUczRCxRQUFRLENBQUNLLGFBQVQsQ0FBdUIsa0JBQXZCLENBQTNCO0lBQ0EsTUFBTXVELFVBQVUsR0FBRzVELFFBQVEsQ0FBQ0ssYUFBVCxDQUF1QixjQUF2QixDQUFuQjtJQUNBLE1BQU13RCxhQUFhLEdBQUdELFVBQVUsQ0FBQ3ZELGFBQVgsQ0FBeUIsdUJBQXpCLENBQXRCO0lBQ0EsTUFBTXlELHFCQUFxQixHQUFHRixVQUFVLENBQUN2RCxhQUFYLENBQXlCLHNCQUF6QixDQUE5QjtJQUNBLE1BQU0wRCxVQUFVLEdBQUdILFVBQVUsQ0FBQ3ZELGFBQVgsQ0FBeUIsY0FBekIsQ0FBbkI7SUFDQSxNQUFNMkQsZUFBZSxHQUFHSixVQUFVLENBQUN2RCxhQUFYLENBQXlCLGtCQUF6QixDQUF4QjtJQUNBLE1BQU00RCxhQUFhLEdBQUdMLFVBQVUsQ0FBQ3ZELGFBQVgsQ0FBeUIsaUJBQXpCLENBQXRCO0lBQ0EsTUFBTTZELFdBQVcsR0FBR2xFLFFBQVEsQ0FBQ21FLGdCQUFULENBQTBCLGVBQTFCLENBQXBCO0lBQ0EsTUFBTUMsa0JBQWtCLEdBQUdwRSxRQUFRLENBQUNLLGFBQVQsQ0FBdUIsd0JBQXZCLENBQTNCO0lBQ0EsTUFBTWdFLFlBQVksR0FBR1QsVUFBVSxDQUFDdkQsYUFBWCxDQUF5QixrQkFBekIsQ0FBckI7SUFDQSxNQUFNaUUsaUJBQWlCLEdBQUd0RSxRQUFRLENBQUNLLGFBQVQsQ0FBdUIsV0FBdkIsQ0FBMUI7SUFDQSxNQUFNa0UsZUFBZSxHQUFHdkUsUUFBUSxDQUFDSyxhQUFULENBQXVCLFVBQXZCLEVBQ25CbUUsT0FEbUIsQ0FFbkJuRSxhQUZtQixDQUVMLFVBRkssQ0FBeEI7O0lBTUEsU0FBU29FLGNBQVQsQ0FBd0JDLElBQXhCLEVBQThCO0lBQzFCYixFQUFBQSxhQUFhLENBQUNjLEdBQWQsR0FBb0JELElBQUksQ0FBQ0UsR0FBekI7SUFDQWIsRUFBQUEsVUFBVSxDQUFDYyxXQUFYLEdBQXlCSCxJQUFJLENBQUNJLEtBQTlCO0lBQ0FkLEVBQUFBLGVBQWUsQ0FBQ2EsV0FBaEIsR0FBOEJILElBQUksQ0FBQ0ssV0FBbkM7O0lBQ0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHZCxXQUFXLENBQUNlLE1BQWhDLEVBQXdDRCxDQUFDLEVBQXpDLEVBQTZDO0lBQ3pDZCxJQUFBQSxXQUFXLENBQUNjLENBQUQsQ0FBWCxDQUFlSCxXQUFmLEdBQTZCSCxJQUFJLENBQUNRLFFBQUwsQ0FBY0YsQ0FBZCxDQUE3QjtJQUNIO0lBQ0o7O0lBRUQsU0FBU0csa0JBQVQsQ0FBNEJULElBQTVCLEVBQWtDO0lBQzlCLE1BQUlVLFVBQVUsR0FBR2IsZUFBZSxDQUFDYyxTQUFoQixDQUEwQixJQUExQixDQUFqQjtJQUNBRCxFQUFBQSxVQUFVLENBQUMvRSxhQUFYLENBQXlCLGVBQXpCLEVBQTBDc0UsR0FBMUMsR0FBZ0RELElBQUksQ0FBQ0UsR0FBckQ7SUFDQVEsRUFBQUEsVUFBVSxDQUFDL0UsYUFBWCxDQUF5QixpQkFBekIsRUFBNEN3RSxXQUE1QyxHQUEwREgsSUFBSSxDQUFDSSxLQUEvRDtJQUNBTSxFQUFBQSxVQUFVLENBQUMvRSxhQUFYLENBQXlCLG9CQUF6QixFQUErQ3dFLFdBQS9DLEdBQTZESCxJQUFJLENBQUNRLFFBQWxFO0lBQ0FFLEVBQUFBLFVBQVUsQ0FBQ25GLGdCQUFYLENBQTRCLE9BQTVCLEVBQXFDLFVBQVVWLEdBQVYsRUFBZTtJQUNoRGtDLElBQUFBLFdBQUEsQ0FBa0JtQyxVQUFsQjtJQUNBYSxJQUFBQSxjQUFjLENBQUNDLElBQUQsQ0FBZDtJQUNILEdBSEQ7SUFJQSxTQUFPVSxVQUFQO0lBQ0g7O0lBR0QsU0FBU0UscUJBQVQsQ0FBK0JaLElBQS9CLEVBQXFDO0lBQ2pDLE1BQUlhLFFBQVEsR0FBR3ZGLFFBQVEsQ0FBQ3dGLHNCQUFULEVBQWY7O0lBQ0EsT0FBSyxJQUFJQyxJQUFULElBQWlCZixJQUFqQixFQUF1QjtJQUNuQmEsSUFBQUEsUUFBUSxDQUFDRyxXQUFULENBQXFCUCxrQkFBa0IsQ0FBQ00sSUFBRCxDQUF2QztJQUNIOztJQUNEbkIsRUFBQUEsaUJBQWlCLENBQUNvQixXQUFsQixDQUE4QkgsUUFBOUI7SUFDSDtJQUtEOzs7SUFHQWxCLFlBQVksQ0FBQ00sR0FBYixHQUFvQixjQUFhZ0IsSUFBSSxDQUFDQyxJQUFMLENBQVVELElBQUksQ0FBQ0UsTUFBTCxLQUFnQixDQUExQixDQUE2QixNQUE5RDtJQUNBekIsa0JBQWtCLENBQUN0RSxTQUFuQixDQUE2QkksR0FBN0IsQ0FBaUMsaUJBQWpDO0lBQ0F5RCxrQkFBa0IsQ0FBQzdELFNBQW5CLENBQTZCSSxHQUE3QixDQUFpQyxpQkFBakM7SUFHQTRELHFCQUFxQixDQUFDN0QsZ0JBQXRCLENBQXVDLE9BQXZDLEVBQWdELFlBQVk7SUFDMUR3QixFQUFBQSxZQUFBLENBQW1CbUMsVUFBbkI7SUFDRCxDQUZEOztJQzdEQSxNQUFNa0MsZUFBZSxHQUFHLEVBQXhCO0lBQ0EsTUFBTUMsUUFBUSxHQUFHLEVBQWpCO0lBQ0EsTUFBTUMsUUFBUSxHQUFHLEdBQWpCO0lBRUEsTUFBTUMsSUFBSSxHQUFHO0lBQ1RyQixFQUFBQSxHQUFHLEVBQUUsRUFESTtJQUVURSxFQUFBQSxLQUFLLEVBQUUsRUFGRTtJQUdUSSxFQUFBQSxRQUFRLEVBQUUsQ0FBQyxjQUFELEVBQWlCLGdDQUFqQixFQUFtRCwrREFBbkQsRUFBb0gsNkNBQXBILEVBQW1LLDBGQUFuSyxFQUErUCx1R0FBL1AsRUFBd1cseURBQXhXLEVBQW1hLGlEQUFuYSxDQUhEO0lBSVRILEVBQUFBLFdBQVcsRUFBRSxDQUFDLHNCQUFELEVBQXlCLDZCQUF6QixFQUF3RCx5QkFBeEQsRUFBbUYsYUFBbkYsRUFBa0csMEJBQWxHLEVBQThILHdEQUE5SCxFQUF3TCxnQ0FBeEwsRUFBME4sZ0JBQTFOO0lBSkosQ0FBYjs7SUFPQSxDQUFDLFlBQVk7SUFDVCxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLElBQUljLGVBQXJCLEVBQXNDZCxDQUFDLEVBQXZDLEVBQTJDO0lBQ3ZDaUIsSUFBQUEsSUFBSSxDQUFDckIsR0FBTCxDQUFTc0IsSUFBVCxDQUFlLFVBQVNsQixDQUFFLE1BQTFCO0lBQ0g7SUFDSixDQUpEOztJQUtBLENBQUMsWUFBWTtJQUNULE9BQUssSUFBSUEsQ0FBQyxHQUFHZSxRQUFiLEVBQXVCZixDQUFDLElBQUlnQixRQUE1QixFQUFzQ2hCLENBQUMsRUFBdkMsRUFBMkM7SUFDdkNpQixJQUFBQSxJQUFJLENBQUNuQixLQUFMLENBQVdvQixJQUFYLENBQWdCbEIsQ0FBaEI7SUFFSDtJQUNKLENBTEQ7O0lBUUEsU0FBU21CLFlBQVQsQ0FBc0JDLEdBQXRCLEVBQTJCO0lBQ3ZCLFNBQU9ULElBQUksQ0FBQ1UsS0FBTCxDQUFXVixJQUFJLENBQUNFLE1BQUwsS0FBZ0JPLEdBQTNCLENBQVA7SUFDSDs7SUFFRCxNQUFNRSxTQUFTLEdBQUcsRUFBbEI7O0lBR0EsU0FBU0MsZ0JBQVQsQ0FBMEI3QixJQUExQixFQUFnQzhCLFNBQWhDLEVBQTJDQyxRQUEzQyxFQUFxRDtJQUNqRCxPQUFLLElBQUl6QixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHeUIsUUFBcEIsRUFBOEJ6QixDQUFDLEVBQS9CLEVBQW1DO0lBQy9CLFFBQUkwQixHQUFHLEdBQUcsRUFBVjs7SUFDQSxTQUFLLElBQUlDLE9BQVQsSUFBb0JqQyxJQUFwQixFQUEwQjtJQUN0QixVQUFJa0MsWUFBWSxHQUFHVCxZQUFZLENBQUN6QixJQUFJLENBQUNpQyxPQUFELENBQUosQ0FBYzFCLE1BQWQsR0FBdUIsQ0FBeEIsQ0FBL0I7O0lBQ0EsVUFBSTBCLE9BQU8sS0FBSyxLQUFoQixFQUF1QjtJQUNuQkQsUUFBQUEsR0FBRyxDQUFDQyxPQUFELENBQUgsR0FBZWpDLElBQUksQ0FBQ2lDLE9BQUQsQ0FBSixDQUFjM0IsQ0FBZCxDQUFmO0lBQ0g7O0lBQ0QsVUFBSTJCLE9BQU8sS0FBSyxVQUFoQixFQUE0QjtJQUN4QkQsUUFBQUEsR0FBRyxDQUFDQyxPQUFELENBQUgsR0FBZSxFQUFmOztJQUNBLGFBQUssSUFBSTNCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsQ0FBcEIsRUFBdUJBLENBQUMsRUFBeEIsRUFBNEI7SUFDeEIwQixVQUFBQSxHQUFHLENBQUNDLE9BQUQsQ0FBSCxDQUFhVCxJQUFiLENBQWtCeEIsSUFBSSxDQUFDaUMsT0FBRCxDQUFKLENBQWNSLFlBQVksQ0FBQ3pCLElBQUksQ0FBQ2lDLE9BQUQsQ0FBSixDQUFjMUIsTUFBZCxHQUF1QixDQUF4QixDQUExQixDQUFsQjtJQUNIO0lBQ0o7O0lBQ0QsVUFBSTBCLE9BQU8sS0FBSyxZQUFaLElBQTRCQSxPQUFPLEtBQUssY0FBeEMsSUFBMERBLE9BQU8sS0FBSyxLQUF0RSxJQUErRUEsT0FBTyxLQUFLLFVBQS9GLEVBQTJHO0lBQ3ZHRCxRQUFBQSxHQUFHLENBQUNDLE9BQUQsQ0FBSCxHQUFlakMsSUFBSSxDQUFDaUMsT0FBRCxDQUFKLENBQWNDLFlBQWQsQ0FBZjtJQUNIO0lBQ0o7O0lBQ0RKLElBQUFBLFNBQVMsQ0FBQ04sSUFBVixDQUFlUSxHQUFmO0lBQ0g7SUFDSjs7SUFFREgsZ0JBQWdCLENBQUNOLElBQUQsRUFBT0ssU0FBUCxFQUFrQlIsZUFBbEIsQ0FBaEI7O0lDbkRBLE1BQU0xRixlQUFhLEdBQUdKLFFBQVEsQ0FBQ0ssYUFBVCxDQUF1QixhQUF2QixDQUF0QjtJQUNBLE1BQU13RyxPQUFPLEdBQUd6RyxlQUFhLENBQUNDLGFBQWQsQ0FBNEIsaUJBQTVCLENBQWhCO0lBQ0EsTUFBTXlHLFFBQVEsR0FBRzFHLGVBQWEsQ0FBQ0MsYUFBZCxDQUE0QixvQkFBNUIsQ0FBakI7SUFDQSxNQUFNMEcsWUFBWSxHQUFHM0csZUFBYSxDQUFDQyxhQUFkLENBQTRCLHFCQUE1QixDQUFyQjs7SUFFQSxNQUFNMkcsc0JBQXNCLEdBQUluSCxPQUFELElBQWE7SUFFeEMsTUFBSW9ILE1BQU0sR0FBRyxrQkFBYjtJQUNBLE1BQUlDLEdBQUcsR0FBR3JILE9BQU8sQ0FBQzJCLEtBQWxCO0lBQ0EsTUFBSTJGLEdBQUcsR0FBR0QsR0FBRyxDQUFDRSxLQUFKLENBQVVILE1BQVYsQ0FBVjs7SUFDQSxNQUFJSSxNQUFNLEdBQUcsQ0FBQ0osTUFBRCxFQUFTQyxHQUFULEtBQWlCRCxNQUFNLENBQUNLLElBQVAsQ0FBWUosR0FBWixDQUE5Qjs7SUFFQSxNQUFJRyxNQUFNLENBQUMsZ0JBQUQsRUFBbUJILEdBQW5CLENBQVYsRUFBbUM7SUFDL0JySCxJQUFBQSxPQUFPLENBQUMwSCxpQkFBUixDQUEwQixtREFBMUI7SUFDQTFILElBQUFBLE9BQU8sQ0FBQzJILGNBQVI7SUFDQTNILElBQUFBLE9BQU8sQ0FBQ2tDLEtBQVIsQ0FBYzBGLE9BQWQsR0FBd0IsZUFBeEI7SUFHSCxHQU5ELE1BTU8sSUFBSUosTUFBTSxDQUFDLGtEQUFELEVBQXFESCxHQUFyRCxDQUFWLEVBQXFFO0lBQ3hFckgsSUFBQUEsT0FBTyxDQUFDMEgsaUJBQVIsQ0FBMEIsK0JBQTFCO0lBQ0ExSCxJQUFBQSxPQUFPLENBQUMySCxjQUFSO0lBQ0EzSCxJQUFBQSxPQUFPLENBQUNrQyxLQUFSLENBQWMwRixPQUFkLEdBQXdCLGVBQXhCO0lBRUgsR0FMTSxNQUtBLElBQUlKLE1BQU0sQ0FBQyxzQkFBRCxFQUF5QkgsR0FBekIsQ0FBVixFQUF5QztJQUM1Q3JILElBQUFBLE9BQU8sQ0FBQzBILGlCQUFSLENBQTBCLGdDQUExQjtJQUNBMUgsSUFBQUEsT0FBTyxDQUFDMkgsY0FBUjtJQUNBM0gsSUFBQUEsT0FBTyxDQUFDa0MsS0FBUixDQUFjMEYsT0FBZCxHQUF3QixlQUF4QjtJQUNILEdBSk0sTUFJQSxJQUFJSixNQUFNLENBQUMsa0JBQUQsRUFBcUJILEdBQXJCLENBQVYsRUFBcUM7SUFDeENRLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLEtBQVo7SUFDQTlILElBQUFBLE9BQU8sQ0FBQzBILGlCQUFSLENBQTBCLG9EQUExQjtJQUNBMUgsSUFBQUEsT0FBTyxDQUFDMkgsY0FBUjtJQUNBM0gsSUFBQUEsT0FBTyxDQUFDa0MsS0FBUixDQUFjMEYsT0FBZCxHQUF3QixlQUF4QjtJQUNILEdBTE0sTUFLQSxJQUFJSixNQUFNLENBQUMsdUJBQUQsRUFBMEJILEdBQTFCLENBQVYsRUFBMEM7SUFDN0NySCxJQUFBQSxPQUFPLENBQUMwSCxpQkFBUixDQUEwQixzQ0FBMUI7SUFDQTFILElBQUFBLE9BQU8sQ0FBQzJILGNBQVI7SUFDQTNILElBQUFBLE9BQU8sQ0FBQ2tDLEtBQVIsQ0FBYzBGLE9BQWQsR0FBd0IsZUFBeEI7SUFDSCxHQUpNLE1BSUEsSUFBSUosTUFBTSxDQUFDLGtCQUFELEVBQXFCSCxHQUFyQixDQUFWLEVBQXFDO0lBQ3hDckgsSUFBQUEsT0FBTyxDQUFDMEgsaUJBQVIsQ0FBMEIsNEVBQTFCO0lBQ0ExSCxJQUFBQSxPQUFPLENBQUMySCxjQUFSO0lBQ0EzSCxJQUFBQSxPQUFPLENBQUNrQyxLQUFSLENBQWMwRixPQUFkLEdBQXdCLGVBQXhCO0lBQ0gsR0FKTSxNQUlBO0lBQ0g1SCxJQUFBQSxPQUFPLENBQUMwSCxpQkFBUixDQUEwQixFQUExQjtJQUNBMUgsSUFBQUEsT0FBTyxDQUFDMkgsY0FBUjtJQUNBM0gsSUFBQUEsT0FBTyxDQUFDa0MsS0FBUixDQUFjMEYsT0FBZCxHQUF3QixFQUF4QjtJQUNIOztJQUNELE1BQUlOLEdBQUosRUFBUztJQUNMLFFBQUlTLE1BQU0sR0FBR1QsR0FBRyxDQUFDVSxRQUFKLEdBQWVDLFdBQWYsR0FBNkJDLEtBQTdCLENBQW1DLEdBQW5DLENBQWI7O0lBQ0EsU0FBSyxJQUFJdEMsSUFBVCxJQUFpQm1DLE1BQWpCLEVBQXlCO0lBQ3JCLFVBQUlJLFFBQVEsR0FBRyxDQUFmOztJQUNBLFdBQUssSUFBSWhELENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUc0QyxNQUFNLENBQUMzQyxNQUEzQixFQUFtQ0QsQ0FBQyxFQUFwQyxFQUF3QztJQUNwQyxZQUFJUyxJQUFJLEtBQUttQyxNQUFNLENBQUM1QyxDQUFELENBQW5CLEVBQXdCO0lBQ3BCZ0QsVUFBQUEsUUFBUTtJQUNYO0lBQ0o7O0lBRUQsVUFBSUEsUUFBUSxHQUFHLENBQWYsRUFBa0I7SUFDZG5JLFFBQUFBLE9BQU8sQ0FBQzBILGlCQUFSLENBQTBCLHdEQUExQjtJQUNBMUgsUUFBQUEsT0FBTyxDQUFDMkgsY0FBUjtJQUNBM0gsUUFBQUEsT0FBTyxDQUFDa0MsS0FBUixDQUFjMEYsT0FBZCxHQUF3QixlQUF4QjtJQUNIO0lBQ0o7SUFDSjtJQUdKLENBM0REOztJQThEQSxNQUFNUSx1QkFBdUIsR0FBSXBJLE9BQUQsSUFBYTtJQUN6QyxNQUFJQSxPQUFPLENBQUNxSSxRQUFSLENBQWlCQyxPQUFyQixFQUE4QjtJQUMxQnRJLElBQUFBLE9BQU8sQ0FBQzBILGlCQUFSLENBQTBCLDJEQUExQjtJQUNBMUgsSUFBQUEsT0FBTyxDQUFDa0MsS0FBUixDQUFjMEYsT0FBZCxHQUF3QixlQUF4QjtJQUNILEdBSEQsTUFHTztJQUNINUgsSUFBQUEsT0FBTyxDQUFDMEgsaUJBQVIsQ0FBMEIsRUFBMUI7SUFDQTFILElBQUFBLE9BQU8sQ0FBQ2tDLEtBQVIsQ0FBYzBGLE9BQWQsR0FBd0IsRUFBeEI7SUFDSDtJQUVKLENBVEQ7O0lBV0FWLFlBQVksQ0FBQzlHLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLFlBQVk7SUFDL0MrRyxFQUFBQSxzQkFBc0IsQ0FBQ0gsT0FBRCxDQUF0QjtJQUNBb0IsRUFBQUEsdUJBQXVCLENBQUNuQixRQUFELENBQXZCO0lBQ0gsQ0FIRDtJQUtBRCxPQUFPLENBQUM1RyxnQkFBUixDQUF5QixTQUF6QixFQUFvQyxVQUFVVixHQUFWLEVBQWU7SUFDL0NBLEVBQUFBLEdBQUcsQ0FBQzZJLGVBQUo7SUFDSCxDQUZEO0lBSUF0QixRQUFRLENBQUM3RyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxVQUFVVixHQUFWLEVBQWU7SUFDaERBLEVBQUFBLEdBQUcsQ0FBQzZJLGVBQUo7SUFDSCxDQUZEOztJQ25GQTlDLHFCQUFxQixDQUFDZ0IsU0FBRCxDQUFyQjs7OzsifQ==
