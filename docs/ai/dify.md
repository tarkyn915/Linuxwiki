# Dify

https://dify.ai/

开源的 LLM 应用开发平台，用可视化工作流把知识库检索、大模型和工具串起来，做出对话助手、知识库问答和 Agent

安装 Docker 和 Git

```bash
curl -fsSL https://get.docker.com | bash
apt-get update && apt-get install -y git
```

克隆 Dify 源码并启动容器

```bash
git clone https://github.com/langgenius/dify.git --depth 1
cd dify/docker
cp .env.example .env
docker compose up -d
```

开始的时候需要设置管理员邮箱和账号密码

配置 AI 模型：集成 - 模型供应商 - 安装 OpenAI-API-compatible - 配置好相应的 API KEY

安装时可能遇到无法写入的报错，是因为 docker 默认用普通用户运行，改一下权限即可，目录按实际情况修改

```bash
chown -R 1001:1001 /opt/test/dify/docker/volumes/plugin_daemon
```

## 工作流案例：企业知识库查询助手

![工作室 - 创建 - 创建空白应用](/images/dify/1-create-app.png)

工作室 - 创建 - 创建空白应用 - chatflow

| 节点 | 作用 |
| --- | --- |
| 用户输入 | 接收用户的问题 |
| 知识检索 | 从企业知识库找到相关原文片段 |
| LLM | 根据检索资料和问题组织答案 |
| 直接回复 | 将 LLM 的答案显示给用户 |

创建 chatflow，默认会有用户输入，然后创建一个知识检索，添加知识库

![知识检索节点，添加知识库](/images/dify/2-knowledge-retrieval.png)

后续需要更好地支持同义词、口语化提问时，可以评估高质量向量索引，并配置实际可用的 Embedding 模型

之后连接到 LLM，配置上下文是知识检索，分别设置 SYSTEM 和 USER 提示词

![LLM 节点，上下文设为知识检索](/images/dify/3-llm-context.png)

::: details 提示词
```text
# SYSTEM
你是企业制度查询助手，只依据用户提供的参考资料回答问题。

# USER
请仅依据以下参考资料回答问题，不要使用外部知识。
只回答问题直接涉及的内容，保留资料中的数字、单位、适用条件和限制。
不要补充资料中没有的制度、步骤或建议。
如果资料没有答案，只回复“当前知识库中没有找到相关规定”。

参考资料：
[上下文变量标签]

用户问题：
[用户输入变量标签]
```
:::

最后加一个直接回复，然后插入 `LLM → text`

![直接回复节点，插入 LLM → text](/images/dify/4-direct-reply.png)

