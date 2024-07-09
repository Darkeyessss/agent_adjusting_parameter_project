document.querySelector("#btn-fold-in").addEventListener("click", (e) => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.width = 0

    const btnFoldOut = document.querySelector("#btn-fold-out");
    btnFoldOut.style.display = "inline-block"
})

document.querySelector("#input-send").addEventListener("click", (e) => {
    sendRequest()
})

document.querySelector("#input-chat").addEventListener("keydown", (e) => {
    if(e.keyCode === 13) { 
        sendRequest()
    }
})

document.querySelector("#btn-fold-out").addEventListener("click", (e) => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.style.width = "260px"

    e.target.style.display = "none"
})


let uri = "/chain/tagging_pure/stream_log"
function sendRequest(){
    const text = document.querySelector("#input-chat").value
    const data = {
        input: {
            input: text,
        },
        config: {}
    }; 

    const resLog = document.querySelector("#res-log")
    const selfMsg = document.createElement("div");
    selfMsg.innerText = text;
    selfMsg.className = "self-msg"
    resLog.appendChild(selfMsg);

    const llmMsg = document.createElement("div");
    const llmMsg_P = document.createElement("p");
    llmMsg.className = "llm-msg"
    llmMsg.appendChild(llmMsg_P);
    resLog.appendChild(llmMsg);

    fetch(`http://127.0.0.1:8000${uri}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(response => {
        if (response.ok) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            const res = llmMsg_P;

            
            function read() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        console.log('Stream closed');
                        const llmMsg_toolbar = document.createElement("div");
                        llmMsg_toolbar.className = "tool-bar"
                        llmMsg_toolbar.innerHTML = `
                            <span class="iconfont icon-fuzhi"></span>
                            <span class="iconfont icon-shuaxin"></span>
                            <span class="iconfont icon-cai"></span>
                        `
                        llmMsg.appendChild(llmMsg_toolbar);
                        return;
                    }

                    const chunk = decoder.decode(value, { stream: true });
                    // console.log(1000,chunk.split('\r\n'))
                    chunk.split('\r\n').forEach(eventString => {
                        // console.log(1000,eventString);
                        if (eventString && eventString.startsWith('data: ')) {
                            // console.log(2000,eventString);
                            const str = eventString.substring("data: ".length);
                            const data = JSON.parse(str)
                            // console.log(3000,data);
                            for(const item of data.ops){
                                if(item.op === "add" && item.path === "/logs/ChatOpenAI/streamed_output_str/-"){
                                    // console.log(item.value)
                                    res.innerHTML += item.value;  
                                }
                                if(item.op === "add" && item.path === "/logs/PydanticToolsParser/final_output"){
                                    if(String(item.value.output) !== "null" && String(item.value.output) !== "undefined"){
                                        // console.log(JSON.stringify(item.value.output, null, 2))
                                        res.innerHTML = `<pre>${JSON.stringify(item.value.output, null, 2)}</pre>`;
                                        break;
                                    }
                                }
                            }
                        }
                    });
                    

                    read();
                }).catch(error => {
                    console.error('Stream error', error);
                });
            }

            read();
        } else {
            console.error('Network response was not ok.');
        }
    }).catch(error => {
        console.error('Fetch error:', error);
    });    
}

const selectLLM = document.getElementById('selectLLM');
selectLLM.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    console.log('Selected option:', selectedOption.value);
    uri = `/chain/${selectedOption.value}/stream_log`
});