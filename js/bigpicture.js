import * as utils from './utils.js';
import  * as filters from './filters.js';
import {ajaxGetRequest} from './backend.js';

// ----Дом элементы----//
const picturesContainer = document.querySelector('.pictures');
const filtersActive = document.querySelector('.img-filters');
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
const uploadComment = bigPicture.querySelector('.social__footer-btn');
const commentTemplate = document.querySelector('#comment').
    content.
    querySelector('.social__comment');
const pictureTemplate = document.querySelector('#picture').
    content.
    querySelector('.picture');

// ----Переменные----//
let commentCount;
let clickedItem;// ----Удаляет все мини фото----//
export function clearPictures () {
    while (picturesContainer.querySelectorAll('.picture')[0]) {
        picturesContainer.querySelectorAll('.picture')[0].remove();
    }
}

// ----Создает дом элемент с заданными даннами из data----//
function makePictureElement(data) {
    const newElement = pictureTemplate.cloneNode(true);
    newElement.querySelector('.picture__img').src = data.url;
    newElement.querySelector('.picture__likes').textContent = data.likes;
    newElement.querySelector('.picture__comments').textContent = data.comments.length;
    newElement.addEventListener('click', function(evt) {
        utils.openElement(bigPicture);
        document.body.classList.add('modal-open');
        bigPictureClickHandler(evt, data);

    });

    return newElement;
}

// ----Рендерит элементы на страницу с данными из массива data с мапами----//
export function renderPictureElements(data) {

    const fragment = document.createDocumentFragment();
    for (const item of data) {
        fragment.appendChild(makePictureElement(item));
    }
    picturesContainer.appendChild(fragment);
    filtersActive.classList.remove('img-filters--inactive');
}


// ----Навешивает данные на полноэкранное изображение----//
export function bigPictureClickHandler(evt, data) {
    clickedItem = evt.target;
    commentCount = data.comments.length;
    appendPictureData(data);
    deleteNodes(comments);
    renderCommentElements(data, socialCommentblock);
}

// ----Обновляет инфо о кол-ве комментов----//
function showCurrentCommentsCount() {
    if (commentCount > 4) {
        blockOfcomments.textContent = `5 из ${commentCount} комментариев`;
    } else if (commentCount === 1) {
        blockOfcomments.textContent = `${commentCount} комментарий`;
    } else {
        blockOfcomments.textContent = `${commentCount} комментария`;
    }
}

// ----Добавляет инфо на полноэкранное фото----//
function appendPictureData(data) {
    bigPictureImg.src = data.url;
    likesCount.textContent = data.likes;
    photoDiscrition.textContent = data.description;
    socialAvatar.src = `img/avatar-${Math.ceil(Math.random() * 6)}.svg`;
    loadCommentButton.classList.remove('hidden');
    showCurrentCommentsCount();

}

// ----Удаляет эллементы----//
function deleteNodes(elements) {
    while (elements[0]) {
        elements[0].remove();
    }
}
// ----Элемент для нового коммента----//
function makeCommentElement(data, index) {
    const newElement = commentTemplate.cloneNode(true);
    newElement.querySelector('.social__picture').src = data.avatar;
    newElement.querySelector('.social__text').textContent = data.message;
    if (index) {
        newElement.classList.add('hidden');
    }

    return newElement;
}

// ----Рендерит на фото имеющиеся комменты в базе данных----//
function renderCommentElements(data, container) {
    const fragment = document.createDocumentFragment();
    data.comments.forEach((item, index) => {
        if (index > 4) {
            fragment.appendChild(makeCommentElement(item, index));
        } else {
            fragment.appendChild(makeCommentElement(item));
        }
    });
    container.append(fragment);
}

// ----Показывает скрытые комментарии----//
function showHiddenComments() {
    for (const comment of comments) {
        comment.classList.remove('hidden');
    }
    loadCommentButton.classList.add('hidden');
}

// ----Добавляет новый коммент----//
function addComment(callback) {
    const avatar = `img/avatar-${Math.ceil(Math.random() * 6)}.svg`;
    socialCommentblock.insertAdjacentElement('afterbegin', makeCommentElement({
        'message': commentInput.value,
        avatar,
    }));
    commentCount += 1;
    callback(avatar, commentInput.value);
    commentInput.value = '';
}

// ----Обновляет количество комментов на мини фотках----//
function fakePushToServer(avatar, comment) {
    const arr = filters.filterIdToData['filter-default'];
    arr.find((item) => clickedItem.src.match(/\d+\.jpg$/)[0] ===
            item.url.match(/\d+\.jpg$/)[0]).comments.unshift({avatar,
                message: comment});
    clearPictures();
    renderPictureElements(filters.filterIdToData[filters.clickedFIlter]);
}

// ----Вешает обработчик закрытия полноэкранного изображения----//
bigPictureCloseButton.addEventListener('click', function() {
    utils.closeElement(bigPicture);
});

// ----Вешает обработчик показа скрытых комментов----//
loadCommentButton.addEventListener('click', showHiddenComments);

// ----Вешает обработчик загрузки нового коммента----//
uploadComment.addEventListener('click', function() {
    addComment(fakePushToServer);
    showCurrentCommentsCount();

});

ajaxGetRequest(renderPictureElements)
