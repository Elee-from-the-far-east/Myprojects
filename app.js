const uiController = (function () {
  const selectorsToQuerySelectorArg = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    currentMonth: ".budget__title--month",
    budgetIncome: ".budget__income--value",
    budgetExpenses: ".budget__expenses--value",
    availableBudget: ".budget__value",
    budgetExpensesPercent: ".budget__expenses--percentage",
    expensesList: ".expenses__list",
    incomeList: ".income__list",
    expenseTmpl: "#expense",
    incomeTmpl: "#income",
    deleteButton: ".item__delete--btn",
  };

  const getQueryArgs = function () {
    return selectorsToQuerySelectorArg;
  };

  const getInput = function () {
    const inputData = {
      type: document.querySelector(selectorsToQuerySelectorArg.inputType).value,
      description: document.querySelector(
        selectorsToQuerySelectorArg.inputDescription
      ).value,
      value: document.querySelector(selectorsToQuerySelectorArg.inputValue)
        .value,
    };
    document.querySelector(selectorsToQuerySelectorArg.inputDescription).value =
      "";
    document.querySelector(selectorsToQuerySelectorArg.inputValue).value = "";
    return inputData;
  };

  const validateInput = function (input, data) {
    if (!input.description.trim()) {
      alert("Введите название статьи расходов или доходов!");
      return false;
    } else if (input.type === "exp" && !data.totalInc) {
      alert("Введите бюджет перед тем как вносить траты!");
      return false;
    } else {
      return true;
    }
  };

  const renderCurrentMonth = function () {
    document.querySelector(
      selectorsToQuerySelectorArg.currentMonth
    ).textContent = new Date().toLocaleDateString("ru", { month: "long" });
  };

  const renderBudgetNumbers = function (expenses) {
    const percent = ((expenses.totalExp / expenses.totalInc) * 100).toFixed(0);
    document.querySelector(
      selectorsToQuerySelectorArg.budgetIncome
    ).textContent = expenses.totalInc;
    document.querySelector(
      selectorsToQuerySelectorArg.budgetExpenses
    ).textContent = expenses.totalExp;
    document.querySelector(
      selectorsToQuerySelectorArg.availableBudget
    ).textContent = expenses.availableSum;
    document.querySelector(
      selectorsToQuerySelectorArg.budgetExpensesPercent
    ).textContent = isNaN(percent) ? 0 + "%" : percent + "%";
  };

  const clearBudgetItems = function () {
    Array.from(
      document.querySelector(selectorsToQuerySelectorArg.incomeList).children
    ).forEach((el) => el.remove());
    Array.from(
      document.querySelector(selectorsToQuerySelectorArg.expensesList).children
    ).forEach((el) => el.remove());
  };

  const updateIncomeItemList = function (id) {
    Array.from(
      document.querySelector(selectorsToQuerySelectorArg.incomeList).children
    )
      .find((el) => el.id === id)
      .remove();
  };

  const updateExpenseItemList = function (id) {
    Array.from(
      document.querySelector(selectorsToQuerySelectorArg.expensesList).children
    )
      .find((el) => el.id === id)
      .remove();
  };

  const createBudgetItem = function (
    budgetItemData,
    selectorOfTmpl,
    totalData
  ) {
    const tmpl = document.querySelector(selectorOfTmpl);
    const newItem = document.importNode(tmpl.content, true);
    const percentage = newItem.querySelector(".item__percentage");
    newItem.querySelector(".item__description").textContent =
      budgetItemData.description;
    newItem.querySelector(".item__value").textContent = budgetItemData.value;
    newItem.querySelector(".item").id =
      selectorOfTmpl + "-" + budgetItemData.id;
    if (percentage)
      percentage.textContent =
        ((Number(budgetItemData.value) / totalData.totalInc) * 100).toFixed(0) +
        "%";
    return newItem;
  };

  const renderBudgetItems = function (totalData, budgetType) {
    const typeMap = {
      inc: {
        container: document.createDocumentFragment(),
        list: document.querySelector(selectorsToQuerySelectorArg.incomeList),
        listItems: document.querySelector(
          selectorsToQuerySelectorArg.incomeList
        ).children,
        selector: selectorsToQuerySelectorArg.incomeTmpl,
      },
      exp: {
        container: document.createDocumentFragment(),
        list: document.querySelector(selectorsToQuerySelectorArg.expensesList),
        listItems: document.querySelector(
          selectorsToQuerySelectorArg.expensesList
        ).children,
        selector: selectorsToQuerySelectorArg.expenseTmpl,
      },
    };

    const result = totalData[budgetType].find((el) => {
      return Array.from(typeMap[budgetType].listItems).every(
        (i) => Number(i.id.split("-")[1]) !== el.id
      );
    });
    if (result) {
      typeMap[budgetType].container.appendChild(
        createBudgetItem(result, typeMap[budgetType].selector, totalData)
      );
      typeMap[budgetType].list.appendChild(typeMap[budgetType].container);
    }
  };

  const renderBudgetItemsOnFirstLoad = function (localStorageData) {
    localStorageData.inc.forEach(() =>
      renderBudgetItems(localStorageData, "inc")
    );
    localStorageData.exp.forEach(() =>
      renderBudgetItems(localStorageData, "exp")
    );
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
    renderBudgetItemsOnFirstLoad,
  });
})();

const dataController = (function () {
  const data = {
    inc: [],
    exp: [],
    totalInc: 0,
    totalExp: 0,
    availableSum: 0,
  };

  const updateDataFromLocalStorage = function () {
    if (localStorage.getItem("budgetItems")) {
      const storageData = JSON.parse(localStorage.getItem("budgetItems"));
      for (const dataKey in data) {
        data[dataKey] = storageData[dataKey];
      }
    }
  };

  const getData = function () {
    return data;
  };

  const updateData = function (id, type) {
    const index = data[type].findIndex(
      (el) => el.id === Number(id.split("-")[1])
    );
    data[type].splice(index, 1);
    findTotals();
    storeDataToLocalStorage();
  };

  const findTotals = function () {
    data.totalInc = data.inc.reduce(
      (previousValue, currentValue) =>
        Number(currentValue.value) + Number(previousValue),
      0
    );
    data.totalExp = data.exp.reduce(
      (previousValue, currentValue) =>
        Number(currentValue.value) + Number(previousValue),
      0
    );
    data.availableSum =
      data.totalInc - data.totalExp < 0 ? 0 : data.totalInc - data.totalExp;
  };

  const storeDataToLocalStorage = function () {
    localStorage.setItem("budgetItems", JSON.stringify(data));
  };

  const storeData = function ({ description, value, type }) {
    const id = data[type][0] ? data[type][data[type].length - 1].id + 1 : 0;
    data[type].push({ id, value, description });
    findTotals();
    storeDataToLocalStorage();
  };

  return Object.freeze({
    storeData,
    getData,
    updateData,
    updateDataFromLocalStorage,
  });
})();

const controller = (function (dataController, uiController) {
  const querySelectorArgs = uiController.getQueryArgs();

  const addExpenseHandler = function () {
    const data = uiController.getInput();
    if (uiController.validateInput(data, dataController.getData())) {
      dataController.storeData(data);
      uiController.renderBudgetNumbers(dataController.getData());
      uiController.renderBudgetItems(dataController.getData(), data.type);
    }
  };

  const deleteBudgetItemHandler = function (e) {
    if (e.target.closest("button")) {
      const id = e.target.closest(".item").id;
      if (e.target.closest(querySelectorArgs.incomeList)) {
        uiController.updateIncomeItemList(id);
        dataController.updateData(id, "inc");
      } else {
        uiController.updateExpenseItemList(id);
        dataController.updateData(id, "exp");
      }
      uiController.renderBudgetNumbers(dataController.getData());
    }
  };

  const setupEventListeners = function () {
    document
      .querySelector(querySelectorArgs.inputButton)
      .addEventListener("click", addExpenseHandler);
    document
      .querySelector(querySelectorArgs.incomeList)
      .addEventListener("click", deleteBudgetItemHandler);
    document
      .querySelector(querySelectorArgs.expensesList)
      .addEventListener("click", deleteBudgetItemHandler);
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
