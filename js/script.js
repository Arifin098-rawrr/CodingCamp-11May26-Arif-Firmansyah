const form = document.getElementById("expenseForm");
const transactionList = document.getElementById("transactionList");
const totalBalance = document.getElementById("totalBalance");
const sortOption = document.getElementById("sortOption");
const themeToggle = document.getElementById("themeToggle");

let transactions =
  JSON.parse(localStorage.getItem("transactions")) || [];

let chart;

function saveToLocalStorage() {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(number);
}

function updateBalance() {

  const total = transactions.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  totalBalance.innerText = formatRupiah(total);
}

function renderTransactions(data = transactions) {

  transactionList.innerHTML = "";

  data.forEach((transaction, index) => {

    const div = document.createElement("div");

    div.classList.add("transaction-item");

    div.innerHTML = `
      <div class="transaction-info">
        <strong>${transaction.name}</strong>
        <small>
          ${formatRupiah(transaction.amount)}
          - ${transaction.category}
        </small>
      </div>

      <button class="delete-btn" onclick="deleteTransaction(${index})">
        Delete
      </button>
    `;

    transactionList.appendChild(div);

  });

}

function deleteTransaction(index) {

  transactions.splice(index, 1);

  saveToLocalStorage();

  renderTransactions();

  updateBalance();

  updateChart();

}

form.addEventListener("submit", function(e){

  e.preventDefault();

  const itemName =
    document.getElementById("itemName").value;

  const amount =
    document.getElementById("amount").value;

  const category =
    document.getElementById("category").value;

  const customCategory =
    document.getElementById("customCategory").value;

  const finalCategory =
    customCategory || category;

  if(
    itemName === "" ||
    amount === "" ||
    finalCategory === ""
  ){
    alert("Please fill all fields!");
    return;
  }

  const transaction = {
    name: itemName,
    amount: Number(amount),
    category: finalCategory
  };

  transactions.push(transaction);

  saveToLocalStorage();

  renderTransactions();

  updateBalance();

  updateChart();

  form.reset();

});

sortOption.addEventListener("change", function(){

  let sorted = [...transactions];

  if(this.value === "amount"){

    sorted.sort((a,b) => a.amount - b.amount);

  }else if(this.value === "category"){

    sorted.sort((a,b) =>
      a.category.localeCompare(b.category)
    );

  }

  renderTransactions(sorted);

});

function updateChart(){

  const categories = {};
  
  transactions.forEach(item => {

    if(categories[item.category]){

      categories[item.category] += item.amount;

    }else{

      categories[item.category] = item.amount;

    }

  });

  const labels = Object.keys(categories);

  const data = Object.values(categories);

  const ctx =
    document.getElementById("expenseChart");

  if(chart){
    chart.destroy();
  }

  chart = new Chart(ctx, {

    type:"pie",

    data:{
      labels:labels,

      datasets:[{
        data:data
      }]
    }

  });

}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode");

  if(document.body.classList.contains("dark-mode")){

    themeToggle.innerText = "☀️ Light Mode";

  }else{

    themeToggle.innerText = "🌙 Dark Mode";

  }

});

renderTransactions();

updateBalance();

updateChart();