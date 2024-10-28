const email = document.getElementById('email');
const form = document.getElementById('form');
const error = document.getElementById('error')
var x = window.matchMedia("(min-width: 500px)")

form.addEventListener('submit', (e) =>{
    e.preventDefault();
    validateInputs();
})

const errorMsg = (element, message) =>{
    const errorDisplay = document.querySelector('#error')
    errorDisplay.innerHTML = message;
}

const successMsg = (element, message) =>{
    const successDisplay = document.querySelector("#error");
    successDisplay.innerHTML = message;
}

const isValidEmail = email =>{
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).toLowerCase())
}

const validateInputs = () =>{
    const emailValue = email.value.trim();
    const empty = ''
    if(x.matches){
        if(emailValue ===''){
            errorMsg(email,"Field is empty")
        }else if(!isValidEmail(emailValue)){
            errorMsg(email, 'Provide correct email')
        }else{
            $(".left-container, ul, form").remove();
            $("p").html("A confirmation email has been sent to <b>" + emailValue + "</b>. Please open it and click the button inside to confirm your subscription.");
            $("h1").text("Thanks for subscribing!");
            document.querySelector('.main-container').style.minWidth = "0px";
            document.querySelector('.main-container').style.width = "400px";
            document.querySelector('.right-container').style.width = "100%";
    
            const newImg = document.createElement("img");
            newImg.style.width = "50px"
            newImg.src = "./assets/images/icon-success.svg"
            const fc = document.querySelector(".right-container").firstChild;
            document.querySelector(".right-container").insertBefore(newImg,fc);
            
            const newButton = document.createElement("button")
            const text = document.createTextNode("Dismiss message");
            newButton.style.width = "100%"
            newButton.appendChild(text)
            document.querySelector(".right-container").appendChild(newButton)
        }
    }else{
        if(emailValue ===''){
            errorMsg(email,"Field is empty")
        }else if(!isValidEmail(emailValue)){
            errorMsg(email, 'Provide correct email')
        }else{
            $(".left-container, ul, form").remove();
            $("p").html("A confirmation email has been sent to <b>" + emailValue + "</b>. Please open it and click the button inside to confirm your subscription.");
            $("h1").text("Thanks for subscribing!");
            document.querySelector('body').style.height = "600px";

            const newImg = document.createElement("img");
            newImg.style.width = "50px"
            newImg.src = "./assets/images/icon-success.svg"
            const fc = document.querySelector(".right-container").firstChild;
            document.querySelector(".right-container").insertBefore(newImg,fc);
            
            const newButton = document.createElement("button")
            const text = document.createTextNode("Dismiss message");
            newButton.style.width = "100%"
            newButton.appendChild(text)
            document.querySelector(".right-container").appendChild(newButton)
        }
    }
    
}
