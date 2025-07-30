import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Send, 
  Lightbulb, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Brain,
  Target,
  TrendingUp,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from "@/services/api";

interface LearningInterfaceProps {
  settings: { model: string };
  onSettingsClick: () => void;
}

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'short-answer';
}

interface LearningRecord {
  topic: string;
  score: number;
  timestamp: Date;
}

const LearningInterface = ({ settings, onSettingsClick }: LearningInterfaceProps) => {
  const [currentTopic, setCurrentTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [learningRecords, setLearningRecords] = useState<LearningRecord[]>([]);
  const [stage, setStage] = useState<'input' | 'explanation' | 'quiz' | 'complete'>('input');
  const { toast } = useToast();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [explanation, questions, showFeedback]);

  const callAI = async (messages: any[]) => {
    return ApiService.chatCompletion({
      model: settings.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    });
  };

  const handleTopicSubmit = async () => {
    if (!currentTopic.trim()) {
      toast({
        title: "请输入学习主题",
        description: "告诉我您想学习什么",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const messages = [
        {
          role: "system",
          content: "You are an excellent AI tutor who excels at explaining complex concepts in simple terms. Please explain the user's concept in clear and concise English, ensuring high school or college students can understand. Your explanation should include: 1) 📚 Basic definition 2) 💡 Simple explanation 3) 🎯 A vivid example. Keep your response within 300 words and use appropriate emojis to make it engaging and easy to follow. Make the explanation fun and memorable!"
        },
        {
          role: "user",
          content: `Please explain this concept: ${currentTopic}`
        }
      ];

      const response = await callAI(messages);
      setExplanation(response);
      setStage('explanation');
    } catch (error) {
      toast({
        title: "解释生成失败",
        description: "请检查网络连接和API设置",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const messages = [
        {
          role: "system",
          content: `你是一个AI题目生成器。根据用户学习的概念"${currentTopic}"，生成2道练习题。请严格按照以下JSON格式回复，不要添加任何其他内容：

[
  {
    "id": "1",
    "question": "题目内容",
    "type": "multiple-choice",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "correctAnswer": "正确答案"
  },
  {
    "id": "2", 
    "question": "题目内容",
    "type": "short-answer",
    "correctAnswer": "参考答案"
  }
]

确保题目难度适中，能够检验学生对概念的理解。`
        },
        {
          role: "user",
          content: `为"${currentTopic}"生成练习题`
        }
      ];

      const response = await callAI(messages);
      
      try {
        const generatedQuestions = JSON.parse(response);
        setQuestions(generatedQuestions);
        setCurrentQuestionIndex(0);
        setStage('quiz');
      } catch (parseError) {
        console.error('JSON解析失败:', response);
        toast({
          title: "题目生成失败",
          description: "AI回复格式错误，请重试",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "题目生成失败",
        description: "请检查网络连接和API设置",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = currentQuestion.type === 'multiple-choice' ? selectedOption : userAnswer;

    if (!answer.trim()) {
      toast({
        title: "请选择或输入答案",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const messages = [
        {
          role: "system",
          content: `你是一个AI评分老师。请评估学生的答案是否正确，并给出简洁的反馈。

题目：${currentQuestion.question}
正确答案：${currentQuestion.correctAnswer}
学生答案：${answer}

请按照以下格式回复：
正确性：[正确/部分正确/错误]
反馈：[简短的解析和建议，50字以内]`
        },
        {
          role: "user",
          content: "请评估这个答案"
        }
      ];

      const response = await callAI(messages);
      const isAnswerCorrect = response.includes('正确性：正确') || response.includes('正确性：部分正确');
      
      setIsCorrect(isAnswerCorrect);
      setFeedback(response);
      setShowFeedback(true);
    } catch (error) {
      toast({
        title: "评分失败",
        description: "请检查网络连接",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
      setUserAnswer("");
      setSelectedOption("");
    } else {
      // 学习完成
      const correctAnswers = questions.filter((_, index) => index <= currentQuestionIndex).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      
      const record: LearningRecord = {
        topic: currentTopic,
        score: score,
        timestamp: new Date()
      };
      
      setLearningRecords(prev => [...prev, record]);
      setStage('complete');
      
      toast({
        title: "学习完成！",
        description: `您的得分：${score}分`,
      });
    }
  };

  const resetLearning = () => {
    setCurrentTopic("");
    setExplanation("");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setSelectedOption("");
    setShowFeedback(false);
    setStage('input');
  };

  const renderCurrentStage = () => {
    switch (stage) {
      case 'input':
        return (
          <Card className="p-6 bg-gradient-card shadow-card border-0 animate-slide-up">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
                <BookOpen className="w-5 h-5 text-primary" />
                今天想学习什么？
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="例如：微积分基本定理、牛顿第二定律、递归算法..."
                  value={currentTopic}
                  onChange={(e) => setCurrentTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTopicSubmit()}
                  className="text-base bg-background border-border"
                />
                <Button 
                  onClick={handleTopicSubmit}
                  disabled={isLoading}
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Lightbulb className="w-4 h-4" />
                      开始学习
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'explanation':
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card shadow-card border-0 animate-slide-up">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{currentTopic}</h3>
                </div>
                <div className="prose prose-sm text-foreground whitespace-pre-wrap">
                  {explanation}
                </div>
              </div>
            </Card>
            
            <div className="flex gap-3">
              <Button onClick={generateQuestions} variant="hero" size="lg" className="flex-1">
                <Target className="w-4 h-4" />
                我理解了，开始练习
              </Button>
              <Button onClick={resetLearning} variant="outline" size="lg">
                <RotateCcw className="w-4 h-4" />
                重新开始
              </Button>
            </div>
          </div>
        );

      case 'quiz':
        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion) return null;

        return (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-card shadow-card border-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="px-3 py-1">
                    题目 {currentQuestionIndex + 1} / {questions.length}
                  </Badge>
                  <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="flex-1 mx-4" />
                </div>
                
                <h3 className="text-lg font-medium text-foreground">{currentQuestion.question}</h3>

                {currentQuestion.type === 'multiple-choice' && currentQuestion.options ? (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedOption === option ? "default" : "outline"}
                        className="w-full justify-start text-left"
                        onClick={() => setSelectedOption(option)}
                        disabled={showFeedback}
                      >
                        {String.fromCharCode(65 + index)}. {option}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Textarea
                    placeholder="请输入您的答案..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={showFeedback}
                    className="bg-background border-border"
                  />
                )}

                {!showFeedback ? (
                  <Button 
                    onClick={submitAnswer}
                    disabled={isLoading}
                    variant="default"
                    size="lg"
                    className="w-full"
                  >
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        提交答案
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Card className={`p-4 border-0 ${isCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                      <div className="flex items-start gap-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                        )}
                        <div className="space-y-2">
                          <p className="font-medium text-foreground">
                            {isCorrect ? "答对了！" : "需要再想想"}
                          </p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {feedback}
                          </p>
                        </div>
                      </div>
                    </Card>
                    
                    <Button onClick={nextQuestion} variant="hero" size="lg" className="w-full">
                      {currentQuestionIndex < questions.length - 1 ? "下一题" : "完成学习"}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        );

      case 'complete':
        const latestRecord = learningRecords[learningRecords.length - 1];
        return (
          <div className="space-y-6">
            <Card className="p-8 bg-gradient-card shadow-card border-0 text-center animate-slide-up">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success text-success-foreground shadow-glow">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">学习完成！</h2>
                <div className="space-y-2">
                  <p className="text-lg text-foreground">主题：{latestRecord?.topic}</p>
                  <p className="text-3xl font-bold text-primary">{latestRecord?.score}分</p>
                </div>
              </div>
            </Card>

            <Button onClick={resetLearning} variant="hero" size="xl" className="w-full">
              开启新的学习
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-soft">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">AI导师</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 pt-8">
        <div className="space-y-6">
          {renderCurrentStage()}
          
          {/* Learning Records */}
          {learningRecords.length > 0 && stage === 'input' && (
            <Card className="p-6 bg-gradient-card shadow-soft border-0">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                学习记录
              </h3>
              <div className="space-y-2">
                {learningRecords.slice(-3).map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                    <span className="text-sm text-foreground">{record.topic}</span>
                    <Badge variant={record.score >= 80 ? "default" : "secondary"}>
                      {record.score}分
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default LearningInterface;