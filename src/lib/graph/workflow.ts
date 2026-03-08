import { StateGraph } from "@langchain/langgraph";
import { ChatGraphState } from "./state";
import { topicRouter } from "./nodes/topicRouter";
import { retrieverNode } from "./nodes/retriever";
import { contextFormatter } from "./nodes/contextFormatter";
import { llmResponder } from "./nodes/llmResponder";

export function createChatGraph() {
  const graph = new StateGraph(ChatGraphState)
    .addNode("topicRouter", topicRouter)
    .addNode("retriever", retrieverNode)
    .addNode("contextFormatter", contextFormatter)
    .addNode("llmResponder", llmResponder)
    .addEdge("__start__", "topicRouter")
    .addEdge("topicRouter", "retriever")
    .addEdge("retriever", "contextFormatter")
    .addEdge("contextFormatter", "llmResponder")
    .addEdge("llmResponder", "__end__");

  return graph.compile();
}
