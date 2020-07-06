import {DOMElements,querySelector} from './utils';

export const renderItem = ({count,text,unit,id}) => {
const markup = ` <li class="shopping__item" id ="${id}">
                    <div class="shopping__count">
                        <p>${count?count:1}</p>
                        <p>${unit}</p>
                    </div>
                    <p class="shopping__description">${text}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </li>`;
DOMElements.shoppingList.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = (id) => {
DOMElements.shoppingList.querySelector('#'+id).remove();
};
