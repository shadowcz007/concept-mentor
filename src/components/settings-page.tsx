import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsPageProps {
  onComplete: (settings: { model: string; token: string }) => void;
}

const SettingsPage = ({ onComplete }: SettingsPageProps) => {
  const [model, setModel] = useState("Qwen/QwQ-32B");
  const [token, setToken] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!token.trim()) {
      toast({
        title: "Token必需",
        description: "请输入您的API Token",
        variant: "destructive",
      });
      return;
    }

    onComplete({ model, token });
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

              <div className="space-y-2">
                <Label htmlFor="token" className="text-sm font-medium text-foreground">API Token</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="请输入您的SiliconFlow API Token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">
                  您可以在 <a href="https://cloud.siliconflow.cn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">SiliconFlow控制台</a> 获取您的API Token
                </p>
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