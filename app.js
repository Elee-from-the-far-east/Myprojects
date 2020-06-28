
const uiController = (function() {
  const selectorsToQuerySelectorArg = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    currentMonth: '.budget__title--month',
    budgetIncome: '.budget__income--value',
    budgetExpenses: '.budget__expenses--value',
    availableBudget: '.budget__value',
    budgetExpensesPercent: '.budget__expenses--percentage',
    expensesList: '.expenses__list',
    incomeList: '.income__list',
    expenseTmpl: '#expense',
    incomeTmpl: '#income',
    deleteButton: '.item__delete--btn'
  };

  const getQueryArgs = function() {
    return selectorsToQuerySelectorArg;
  };

  const getInput = function() {
    const inputData =  {
      type: document.querySelector(selectorsToQuerySelectorArg.inputType).value,
      description: document.querySelector(selectorsToQuerySelectorArg.inputDescription).value,
      value: document.querySelector(selectorsToQuerySelectorArg.inputValue).value,
    };
    document.querySelector(selectorsToQuerySelectorArg.inputDescription).value = '';
    document.querySelector(selectorsToQuerySelectorArg.inputValue).value = '';
    return inputData;
  };


  const validateInput = function(input, data) {
   if(!input.description.trim()){
     alert('Введите название статьи расходов или доходов!');
     return false;
   } else if (input.type === 'exp'&&!data.totalInc){
     alert('Введите бюджет перед тем как вносить траты!');
     return false;
   }
   else {
     return true;
   }
  };


  const renderCurrentMonth = function() {
    const currentMonth = document.querySelector(selectorsToQuerySelectorArg.currentMonth);
    currentMonth.textContent = new Date().
        toLocaleDateString('ru', {month: 'long'});
  };

  const renderBudgetNumbers = function(expenses) {
    const budgetIncome = document.querySelector(selectorsToQuerySelectorArg.budgetIncome);
    const budgetExpenses = document.querySelector(selectorsToQuerySelectorArg.budgetExpenses);
    const budgetExpensesPercent = document.querySelector(selectorsToQuerySelectorArg.budgetExpensesPercent);
    const availableSum = document.querySelector(selectorsToQuerySelectorArg.availableBudget)
    budgetIncome.textContent = expenses.totalInc;
    budgetExpenses.textContent = expenses.totalExp;
    const percent = ((expenses.totalExp / expenses.totalInc) * 100).toFixed(0);
    budgetExpensesPercent.textContent = isNaN(percent)
        ? 0 + '%'
        : percent + '%';
    availableSum.textContent = expenses.availableSum;
  };

const clearBudgetItems = function() {
  const incomeListItems = document.querySelector(selectorsToQuerySelectorArg.incomeList).children;
  const expensesListItems = document.querySelector(selectorsToQuerySelectorArg.expensesList).children;
  Array.from(incomeListItems).forEach(el=>el.remove());
  Array.from(expensesListItems).forEach(el=>el.remove());
};

const updateIncomeItemList = function(id) {
  const incomeListItems = document.querySelector(selectorsToQuerySelectorArg.incomeList).children;
  Array.from(incomeListItems).find(el=>el.id===id).remove();
};

  const updateExpenseItemList = function(id) {
    const expensesListItems = document.querySelector(selectorsToQuerySelectorArg.expensesList).children;
    Array.from(expensesListItems).find(el=>el.id===id).remove();
  };

  const createBudgetItem = function(budgetItemData, selectorOfTmpl, totalData) {
   const tmpl = document.querySelector(selectorOfTmpl);
   const newItem = document.importNode(tmpl.content, true);
   const percentage = newItem.querySelector('.item__percentage');
   newItem.querySelector('.item__description').textContent = budgetItemData.description;
   newItem.querySelector('.item__value').textContent = budgetItemData.value;
   newItem.querySelector('.item').id = selectorOfTmpl + '-' +budgetItemData.id;
   if(percentage)percentage.textContent = (Number(budgetItemData.value)/totalData.totalInc*100).toFixed(0)+'%';
   return newItem

};

  const renderBudgetItems = function(totalData, budgetType){
  const typeMap ={
    inc:{
      container: document.createDocumentFragment(),
      list: document.querySelector(selectorsToQuerySelectorArg.incomeList),
      listItems: document.querySelector(selectorsToQuerySelectorArg.incomeList).children,
      selector: selectorsToQuerySelectorArg.incomeTmpl
    },
    exp:{
      container: document.createDocumentFragment(),
      list: document.querySelector(selectorsToQuerySelectorArg.expensesList),
      listItems: document.querySelector(selectorsToQuerySelectorArg.expensesList).children,
      selector: selectorsToQuerySelectorArg.expenseTmpl
    }
  };

    const result = totalData[budgetType].find(el=>{
      return Array.from(typeMap[budgetType].listItems).every(i=>Number(i.id.split('-')[1])!==el.id)
    });
    if(result){
      typeMap[budgetType].container.appendChild(createBudgetItem(result,typeMap[budgetType].selector,totalData));
      typeMap[budgetType].list.appendChild(typeMap[budgetType].container);}


};

  const renderBudgetItemsOnFirstLoad = function(localStorageData) {
    localStorageData.inc.forEach(el=>renderBudgetItems(localStorageData,'inc'));
    localStorageData.exp.forEach(el=>renderBudgetItems(localStorageData,'exp'));
  };


  return Object.freeze({
    getInput,
    getQueryArgs,
    renderCurrentMonth,
    renderBudgetNumbers,
    clearBudgetItems,
    renderBudgetItems,
    updateIncomeItemList,
    updateExpenseItemList,
    validateInput,
    renderBudgetItemsOnFirstLoad
  });
})();

const dataController = (function() {
  const data = {
    inc: [],
    exp: [],
    totalInc: 0,
    totalExp: 0,
    availableSum: 0,
  };

 const updateDataFromLocalStorage = function() {
   if (localStorage.getItem('budgetItems')) {
     const storageData = JSON.parse((localStorage.getItem('budgetItems')));
     for (const dataKey in data) {
       data[dataKey]=storageData[dataKey];
     }
   }
 };

  const getData = function() {
    return data;
  };

  const updateData = function(id, type) {
    const index = data[type].findIndex(el=>el.id===Number(id));
    data[type].splice(index,1);
    findTotals();
    storeDataToLocalStorage();

  };

  const findTotals = function() {
    data.totalInc = data.inc.map((el) => el.value).reduce(
        (previousValue, currentValue) =>
            Number(currentValue) + Number(previousValue),
        0,
    );
    data.totalExp = data.exp.map((el) => el.value).reduce(
        (previousValue, currentValue) =>
            Number(currentValue) + Number(previousValue),
        0,
    );
    data.availableSum =
        data.totalInc - data.totalExp < 0 ? 0 : data.totalInc - data.totalExp;
  };

  const storeDataToLocalStorage = function() {
    localStorage.setItem('budgetItems', JSON.stringify(data))
  };

  const storeData = function({description, value, type}) {
    const id = data[type].length;
    data[type].push({id, value, description});
    findTotals();
    storeDataToLocalStorage()
  };

  return Object.freeze({
    storeData,
    getData,
    updateData,
    updateDataFromLocalStorage
  });
})();

const controller = (function(dataController, uiController) {
  const querySelectorArgs = uiController.getQueryArgs();

  const addExpenseHandler = function() {
    const data = uiController.getInput();
    if (uiController.validateInput(data,dataController.getData())) {
      dataController.storeData(data);
      uiController.renderBudgetNumbers(dataController.getData());
      uiController.renderBudgetItems(dataController.getData(), data.type)
    }
  };

  const deleteBudgetItemHandler = function(e) {
    if(e.target.closest('button')){
    const id = e.target.closest('.item').id;
    if(e.target.closest(querySelectorArgs.incomeList)) {
      uiController.updateIncomeItemList(id);
      dataController.updateData(id, 'inc');
    }
    else {
      uiController.updateExpenseItemList(id);
      dataController.updateData(id, 'exp');
    }
    uiController.renderBudgetNumbers(dataController.getData());
  }
  };

  const setupEventListeners = function() {
    const addButton = document.querySelector(querySelectorArgs.inputButton);
    const incomeList = document.querySelector(querySelectorArgs.incomeList);
    const expenseList = document.querySelector(querySelectorArgs.expensesList);
    incomeList.addEventListener('click', deleteBudgetItemHandler);
    expenseList.addEventListener('click', deleteBudgetItemHandler);
    addButton.addEventListener('click', addExpenseHandler);
  };

  return Object.freeze({
    init() {
      uiController.renderCurrentMonth();
      uiController.clearBudgetItems();
      dataController.updateDataFromLocalStorage();
      const data = dataController.getData();
      uiController.renderBudgetItemsOnFirstLoad(data);
      uiController.renderBudgetNumbers(data);
      setupEventListeners();
    },
  });
})(dataController, uiController);

controller.init();
