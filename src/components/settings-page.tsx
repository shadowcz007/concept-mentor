import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, Key, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { env, validateEnv } from "@/config/env";

interface SettingsPageProps {
  onComplete: (settings: { model: string }) => void;
}

const SettingsPage = ({ onComplete }: SettingsPageProps) => {
  const [model, setModel] = useState(env.DEFAULT_MODEL);
  const [isEnvValid, setIsEnvValid] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const isValid = validateEnv();
    setIsEnvValid(isValid);
    
    if (!isValid) {
      toast({
        title: "环境变量配置错误",
        description: "请检查 .env 文件中的 API Token 配置",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleSave = () => {
    if (!isEnvValid) {
      toast({
        title: "环境变量配置错误",
        description: "请先配置正确的 API Token",
        variant: "destructive",
      });
      return;
    }

    onComplete({ model });
    toast({
      title: "设置已保存",
      description: "AI导师配置成功！",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-4">
      <div className="max-w-2xl mx-auto pt-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary shadow-glow animate-bounce-gentle">
            <Settings className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">AI导师设置</h1>
          <p className="text-lg text-muted-foreground">配置您的专属AI学习助手</p>
        </div>

        {/* Settings Card */}
        <Card className="p-8 space-y-6 bg-gradient-card shadow-card border-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Key className="w-5 h-5 text-primary" />
              模型配置
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-medium text-foreground">选择AI模型</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="选择模型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Qwen/QwQ-32B">Qwen/QwQ-32B (推荐)</SelectItem>
                    <SelectItem value="Qwen/Qwen2.5-72B-Instruct">Qwen/Qwen2.5-72B-Instruct</SelectItem>
                    <SelectItem value="01-ai/Yi-1.5-34B-Chat-16K">01-ai/Yi-1.5-34B-Chat-16K</SelectItem>
                    <SelectItem value="meta-llama/Meta-Llama-3.1-70B-Instruct">Meta-Llama-3.1-70B-Instruct</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  不同模型具有不同的能力特点，推荐使用QwQ-32B获得最佳学习体验
                </p>
              </div>

              {!isEnvValid && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">环境变量配置错误</p>
                    <p className="text-xs text-muted-foreground">
                      请在项目根目录创建 .env 文件并配置 VITE_SILICONFLOW_API_TOKEN
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">API Token 配置</Label>
                <div className="p-3 bg-muted/50 border border-border rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    API Token 已通过环境变量配置。如需修改，请编辑项目根目录的 .env 文件。
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    您可以在 <a href="https://cloud.siliconflow.cn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SiliconFlow控制台</a> 获取您的API Token
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSave}
              className="w-full"
              variant="hero"
              size="lg"
            >
              <Save className="w-4 h-4" />
              开始学习
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-gradient-card shadow-soft border-0">
          <h3 className="font-semibold text-foreground mb-3">关于AI导师</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• 智能概念讲解：用通俗易懂的语言解释复杂概念</p>
            <p>• 个性化出题：根据您的学习进度生成练习题</p>
            <p>• 即时反馈：实时评估答案并提供改进建议</p>
            <p>• 学习记录：追踪学习进度，调整难度</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;