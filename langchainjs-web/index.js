import { ChatZhipuAI } from "@langchain/community/chat_models/zhipuai";
import { HumanMessage,SystemMessage } from "@langchain/core/messages";

// Default model is glm-3-turbo
// const glm3turbo = new ChatZhipuAI({
//   zhipuAIApiKey: "YOUR-API-KEY", // In Node.js defaults to process.env.ZHIPUAI_API_KEY
// });

// Use glm-4
const glm4 = new ChatZhipuAI({
  model: "glm-4", // Available models:
  temperature: 0.5,
  zhipuAIApiKey: "a737c7414bb2812f661d51b29fec9fb0.UmJjgzYZELuB9Wes", // In Node.js defaults to process.env.ZHIPUAI_API_KEY
});

const messages = [
                  new SystemMessage("Your role is a program coder."),
                  new HumanMessage("小明老婆昨天生了一对龙凤胎，他们还有一个4岁的女儿，那么现在小明一共有几个孩子？分别是几个儿子，几个女儿？"),
                ];

// const res = await glm3turbo.invoke(messages);
/*
AIMessage {
  content: "Hello! How can I help you today? Is there something you would like to talk about or ask about? I'm here to assist you with any questions you may have.",
}
*/
console.log(1000)
try {
  const res2 = await glm4.invoke(messages);
  console.log(res2.content);
} catch (error) {
  console.log(error)
}

/*
AIMessage {
  text: "Hello! How can I help you today? Is there something you would like to talk about or ask about? I'm here to assist you with any questions you may have.",
}
*/

