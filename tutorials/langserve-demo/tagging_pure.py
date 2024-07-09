import os
from dotenv import load_dotenv,find_dotenv
from langchain_core.pydantic_v1 import BaseModel,Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

_ = load_dotenv(find_dotenv())

tagging_prompt = ChatPromptTemplate.from_template("""
请提供一段具体的文本内容以便我从中抽取信息。
仅提取“Classification”函数中提到的属性。

段落:
{input}
""")

class Classification(BaseModel):
    # 格式化输出的内容
    sentiment:str = Field(description="情感倾向")
    aggressiveness:int = Field(description="文本的激烈程度在1到10的范围内是如何的")
    language:str = Field(description="文本使用的什么语言")
    supplement:str = Field(description="对一个主题或概念的额外说明，以帮助理解或澄清先前的信息。它可能包括更详细的描述、例子、定义或相关数据。")


llm = ChatOpenAI(
    base_url="https://open.bigmodel.cn/api/paas/v4",
    api_key=os.environ.get('ZHIPUAI_API_KEY'),
    model="glm-4",
).with_structured_output(Classification)

tagging_chain = tagging_prompt | llm

