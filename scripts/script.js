let answerValues = document.getElementById("answerValues"),
    pointer = document.getElementById("pointer"),
    form = document.getElementById("this_form"),
    errorX = document.getElementsByName("x-radio")[4],
    errorY = document.getElementById('Y-text'),
    grad = "linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)",
    pickedBtn = false,
    errorR = document.getElementById("r-btn-3"),
    X = 0,
    Y = 0,
    R = 1,
    statusBar = document.getElementById("status")
    arrayButton=document.getElementsByClassName("buttonR");
let buttonItems=[].slice.call(arrayButton);

setPointer()

buttonItems.forEach(function choose(btn, index){
    btn.addEventListener('click', function () {
        buttonItems.forEach(
            function disable(btn2, index2) {
                if (index2 !== index) {
                    btn2.style.backgroundImage=""
                }
            }
            )
        R = btn.value
        pickedBtn = true
        btn.style.backgroundImage=grad;
        }
    )
})

function checkX() {
    let X_group = document.getElementsByName("x-radio");
    let flag = true
    for (let i = 0; i < X_group.length; i++) {
        if (X_group[i].checked) {
            flag = false
            X = X_group[i].value
            return true
        }
    }
    if (flag) statusBar.textContent="Выберите X";
    return false
}
function checkY() {
    let Y_text = document.getElementById('Y-text');
    let Y2 = Y_text.value.replace(',', '.')
    if (Y2.trim() === "") {
        statusBar.textContent="Заполните поле Y";
        return false;
    } else if (!isFinite(Y2)) {
        statusBar.textContent="Должно Y быть числом";
        return false;
    } else if (Y2 >= 5 && Y2 <= -3) {
        statusBar.textContent="Должно быть Y в диапазоне (-3; 5)";
        return false;
    } else {
        if (Y2 >= -3 && Y2 <= 5) {
            Y = Y2
            return true
        }
        else {
            statusBar.textContent="Должно быть Y в диапазоне (-3; 5)";
            return false;
        }
    }
}

function checkR() {
    return pickedBtn
}

function setPointer() {
    pointer.setAttribute("visibility", "visible");
    pointer.setAttribute("cx", (X / R * 2 * 60 + 150).toString());
    pointer.setAttribute("cy", (-Y / R * 2 * 60 + 150).toString());
}

function processSubmit() {
    let request = '?x=' + X + '&y=' + Y + '&r=' + R;
    setPointer();
    fetch("scripts/main.php" + request, {
        method: "GET",
        headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
    }).then(response => response.json()).then(function (serverAnswer) {

        let result = "<tr>";
        for (let [index, row] of Object.entries(serverAnswer).reverse()) {
            for (let [key, value] of Object.entries(row)) {
                if (key === "coordsStatus") {
                    let color;
                    if (value === "inside")
                        color = "green"
                    else
                        color = "red"
                    value = "<span style='color: " + color + "'>" + value + "</span>";
                }

                result += "<td>" + value + "</td>"
            }
            result += "</tr>";
        }

        answerValues.innerHTML = result;
        errorX.setCustomValidity('SHIT')
    }).catch(err => console.log(err));
}

document.getElementById("submitButton").onclick = function submit() {
    statusBar.textContent="Be ready to get some errors here."
    if (checkX()) {
        if (checkY()) {
            if (checkR()) {
                processSubmit()
            }else statusBar.textContent="Выберите R next time, please."
        }
    }
}


document.getElementById("clearButton").onclick = function () {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'scripts/clear.php');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            answerValues.innerHTML = "";
        }
    }
    xhr.send()
}