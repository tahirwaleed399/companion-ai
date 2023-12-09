import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = new Pinecone();
  }

  public async init() {
  if(!(this.vectorDBClient instanceof Pinecone)){
this.vectorDBClient =  new Pinecone();
  }
  }

  public async vectorSearch(
    recentChatHistory: string,
    companionFileName: string
  ) {
    console.log('Vector search started');

    


const pineconeIndex = this.vectorDBClient.Index(process.env.PINECONE_INDEX!);

const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  { pineconeIndex }
);



    

    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
      .catch((err) => {
        console.log("WARNING: failed to get vector search results.", err);
      });
      console.log(similarDocs)
    return similarDocs;
  }

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      await MemoryManager.instance.init();
    }
    return MemoryManager.instance;
  }

  private generateRedisCompanionKey(companionKey: CompanionKey): string {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  public async writeToHistory(text: string, companionKey: CompanionKey) {
    console.log('Write to history started')
    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    console.log({
      score: Date.now(),
      member: text,
    })
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });
console.log(result)
    return result;
  }

  public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    console.log('Started Read latest history')

    if (!companionKey || typeof companionKey.userId == "undefined") {
      console.log("Companion key set incorrectly");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });
    console.log('Result of read data here ')
    console.log(result)
  
    result = result.slice(-30).reverse();
    console.log('result after slicing')
    console.log(result)

    const recentChats = result.reverse().join("\n");
    console.log({recentChats})
    return recentChats;
  }

  public async seedChatHistory(
    seedContent: String,
    delimiter: string = "\n",
    companionKey: CompanionKey
  ) {
    console.log('Seeding Chat History Started')
    const key = this.generateRedisCompanionKey(companionKey);
    if (await this.history.exists(key)) {
      console.log("User already has chat history");
      return;
    }

    const content = seedContent.split(delimiter);
    console.log(content)
    let counter = 0;
    for (const line of content) {
      console.log({ score: counter, member: line })
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}
