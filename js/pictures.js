const numberOfObjects = 25;
const minLikes = 15;
const maxLikes = 200;

var DATA = {
    url: [],
    likes: [],
    comments: ['Всё отлично!', 'В целом всё неплохо. Но не всё', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра', 'В конце концов это просто непрофессионально', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше', 'Лица у людей на фотке перекошены, как будто их избивают', 'Как можно было поймать такой неудачный момент?!'],
    description: ['Тестим новую камеру!', 'Затусили с друзьями на море', 'Как же круто тут кормят', 'Отдыхаем...', 'Цените каждое мгновенье.', 'Цените тех, кто рядом с вами и отгоняйте все сомненья.', 'Не обижайте всех словами......', 'Вот это тачка!'],
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


function getRandomInt (max) {
    return Math.floor(Math.random()*max)
}

const photoData = [];
// obj[dataKey]=new Array(data[dataKey][randomNumber])}
function makePhotoDataObj(data, container, totalObj) {
    for (let i = 0; i < totalObj; i++) {
        let obj={};
        for (let dataKey in data) {
            let randomNumber = getRandomInt(data[dataKey].length-1);
            if (dataKey==='url'){
                obj[dataKey]=data[dataKey][i];
            }
            if (dataKey==='comments'){
                obj[dataKey]=[];
                for (let i =0; i<2;i++) {
                    obj[dataKey].push(data[dataKey][getRandomInt(data[dataKey].length-1)])
                }
            }
            if(dataKey!=='urlNumbers'&& dataKey!=='likesNumbers'&&dataKey!=='url'&&dataKey!=='comments'){
                obj[dataKey]= data[dataKey][randomNumber]}
        }
        container.push(obj);
    }
}

makePhotoDataObj(DATA,photoData,numberOfObjects);



const pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

const picture = document.querySelector('.pictures');


function makePictureElement(data){
    let newElement = pictureTemplate.cloneNode(true);
    newElement.querySelector('.picture__img').src = data.url;
    newElement.querySelector('.picture__likes').textContent = data.likes;
    newElement.querySelector('.picture__comments').textContent = data.comments;
    return newElement
}

;


function renderPictureElements (data){
    let fragment = document.createDocumentFragment();
    for (let item of data) {
        fragment.appendChild(makePictureElement(item));
    }
    picture.appendChild(fragment);
}

renderPictureElements(photoData);





const bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
bigPictureImg.src=photoData[0].url;
const likesCount = bigPicture.querySelector('.likes-count');
likesCount.textContent = photoData[0].likes;
const photoDiscrition = bigPicture.querySelector('.social__caption');
photoDiscrition.textContent = photoData[0].description;
const commentList = bigPicture.querySelector('.social__comments');
// Не понятно 5 из восьми комментариев
const commentsCount = bigPicture.querySelector('.comments-count');
commentsCount.textContent = DATA.comments.length;
//
const socialAvatar = bigPicture.querySelector('.social__picture')
socialAvatar.src = `img/avatar-${Math.ceil(Math.random()*6)}.svg`

const commentText = document.querySelectorAll('.social__text');
for (let i = 0; i <commentText.length ; i++) {
    commentText[i].textContent = photoData[0].comments[i];
}



