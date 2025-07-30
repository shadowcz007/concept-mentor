import { useState, useEffect } from "react";
import SettingsPage from "@/components/settings-page";
import LearningInterface from "@/components/learning-interface";

const Index = () => {
  const [settings, setSettings] = useState<{ model: string } | null>(null);

  useEffect(() => {
    // 从localStorage加载设置
    const savedSettings = localStorage.getItem('ai-tutor-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingsComplete = (newSettings: { model: string }) => {
    setSettings(newSettings);
    localStorage.setItem('ai-tutor-settings', JSON.stringify(newSettings));
  };

  const handleSettingsClick = () => {
    setSettings(null);
    localStorage.removeItem('ai-tutor-settings');
  };

  if (!settings) {
    return <SettingsPage onComplete={handleSettingsComplete} />;
  }

  return (
    <LearningInterface 
      settings={settings} 
      onSettingsClick={handleSettingsClick}
    />
  );
};

export default Index;
