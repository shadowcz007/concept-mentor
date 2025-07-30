import { env } from '@/config/env';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class ApiService {
  private static getAuthHeaders() {
    const token = env.SILICONFLOW_API_TOKEN;
    if (!token) {
      throw new Error('API token is not configured. Please check your environment variables.');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  static async chatCompletion(request: ChatCompletionRequest): Promise<string> {
    const response = await fetch(`${env.SILICONFLOW_API_URL}/chat/completions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API调用失败: ${response.status} - ${errorText}`);
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0].message.content;
  }

  static async explainConcept(topic: string, model: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一个专业的AI导师，擅长用通俗易懂的语言解释复杂的概念。请根据用户提供的主题，给出清晰、易懂的解释。'
      },
      {
        role: 'user',
        content: `请解释以下概念：${topic}`
      }
    ];

    return this.chatCompletion({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000
    });
  }

  static async generateQuestions(topic: string, explanation: string, model: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一个专业的AI导师，擅长根据学习内容生成练习题。请生成3道选择题，每道题包含4个选项，其中只有1个正确答案。请以JSON格式返回，格式为：[{"question": "问题", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "解释"}]'
      },
      {
        role: 'user',
        content: `基于以下主题和解释，生成练习题：\n主题：${topic}\n解释：${explanation}`
      }
    ];

    return this.chatCompletion({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000
    });
  }

  static async evaluateAnswer(question: string, userAnswer: string, correctAnswer: string, model: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一个专业的AI导师，擅长评估学生的答案。请根据学生的答案给出详细的反馈和改进建议。'
      },
      {
        role: 'user',
        content: `问题：${question}\n学生答案：${userAnswer}\n正确答案：${correctAnswer}\n请评估这个答案并给出反馈。`
      }
    ];

    return this.chatCompletion({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000
    });
  }
} 