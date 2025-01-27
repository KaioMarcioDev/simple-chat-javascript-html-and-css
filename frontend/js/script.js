//login elementes
const  login = document.querySelector(".login")
const  loginForm = document.querySelector(".login__form")
const  loginInput = document.querySelector(".login__input")
//chat elementes
const  chat = document.querySelector(".chat")
const  chatForm = document.querySelector(".chat__form")
const  chatInput = document.querySelector(".chat__input")
const  chatMessages = document.querySelector(".chat__messages")

const colors = [
    'cadetblue',
    'dargoldenrod',
    'cornflowerblue',
    'darkkhaki',
    'hotpink',
    'gold'
]
const user = {
    id:"",
    name:"",
    color:""
}

let websocket
const creatMessageSelfElement = (content)=>{
    const div = document.createElement('div')
    div.classList.add("message__self")
    div.innerHTML = content
    return div
}
const creatMessageOtherElement = (content, sender, senderColor)=>{
    const div = document.createElement('div')
    const span = document.createElement('span')

    div.classList.add("message__other")
    div.classList.add("message__self")
    span.classList.add("message__sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender

    div.innerHTML += content
    return div
}
const getRandomColor = ()=>{
    const randomIndex =Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}
const scrollScreen = ()=>{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior:"smooth"
    })
}

const processMessage = ({data})=>{
    const {userId, userName, userColor, content} = JSON.parse(data)

    const message = userId == user.id 
    ? creatMessageSelfElement(content):
    creatMessageOtherElement(content, userName ,userColor)


    chatMessages.appendChild(message)
    scrollScreen()
}


const handleLogin = (event)=>{
    event.preventDefault()
    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"
    
    websocket = new WebSocket("wss://chat-backend-ww0u.onrender.com")
    websocket.onmessage = processMessage

    
}

const sendMessage = (event)=>{
    event.preventDefault()

    const message = {
        userId : user.id,
        userName : user.name,
        userColor :user.color,
        content : chatInput.value

    }
    websocket.send(JSON.stringify(message))
    chatInput.value = ""
}

loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMessage)

