'use strict';
import {getRandomInt} from './utils.js';
import {ajaxGetRequest} from './backend.js';
// import {data} from './data.js';

export const filterIdToData = {
    'filter-default': [],
};

export function getServerData(data) {
    return filterIdToData['filter-default'] = data;
}

export function sortByPopularity(data = filterIdToData['filter-default']) {
    let dataCopy = data.slice();
    let newArr = dataCopy.sort((a, b) => {
        return b.comments.length - a.comments.length;
    });

    return filterIdToData['filter-discussed'] = newArr;
}

export function sortByRandom(data = filterIdToData['filter-default']) {
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

    return filterIdToData['filter-random'] = randomArray;
}

// setInterval(function() {
//     console.log(filterIdToData)
// },5000)

