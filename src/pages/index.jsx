// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Input, Label, RadioGroup, RadioGroupItem, Card, CardContent, CardDescription, CardHeader, CardTitle, Slider, Badge, ScrollArea, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui';
// @ts-ignore;
import { ChevronLeft, ChevronRight, RotateCcw, History, User, Save, Download, Trash2, Eye, Home, ArrowLeft, XCircle } from 'lucide-react';

// @ts-ignore;
import { PADVisualization } from '@/components/PADVisualization.jsx';
// @ts-ignore;
import { QuestionHistory } from '@/components/QuestionHistory.jsx';
// @ts-ignore;
import { EmotionDistanceRanking } from '@/components/EmotionDistanceRanking.jsx';
// @ts-ignore;
import { CollapsibleSection } from '@/components/CollapsibleSection.jsx';
// @ts-ignore;
import { ExportButtons } from '@/components/ExportButtons.jsx';

// 使用 localStorage 存储所有数据
const EMOTIONS = [{
  name: '喜悦',
  P: 2.77,
  A: 1.21,
  D: 1.42
}, {
  name: '乐观',
  P: 2.48,
  A: 1.05,
  D: 1.75
}, {
  name: '轻松',
  P: 2.19,
  A: -0.66,
  D: 1.05
}, {
  name: '惊奇',
  P: 1.72,
  A: 1.71,
  D: 0.22
}, {
  name: '温和',
  P: 1.57,
  A: -0.79,
  D: 0.38
}, {
  name: '依赖',
  P: 0.39,
  A: -0.81,
  D: 1.48
}, {
  name: '无聊',
  P: -0.53,
  A: -1.25,
  D: -0.84
}, {
  name: '悲伤',
  P: -0.89,
  A: 0.17,
  D: -0.70
}, {
  name: '恐惧',
  P: -0.93,
  A: 1.30,
  D: -0.64
}, {
  name: '焦虑',
  P: -0.95,
  A: 0.32,
  D: -0.63
}, {
  name: '藐视',
  P: -1.58,
  A: 0.32,
  D: 1.02
}, {
  name: '厌恶',
  P: -1.80,
  A: 0.40,
  D: 0.67
}, {
  name: '愤',
  P: -1.98,
  A: 1.10,
  D: 0.60
}, {
  name: '敌意',
  P: -2.08,
  A: 1.00,
  D: 1.12
}];
const QUESTIONS = [{
  left: '愤怒的',
  right: '有活力的',
  key: 'q1'
}, {
  left: '清醒的',
  right: '困倦的',
  key: 'q2'
}, {
  left: '被控的',
  right: '主控的',
  key: 'q3'
}, {
  left: '友好的',
  right: '轻蔑的',
  key: 'q4'
}, {
  left: '平静的',
  right: '激动的',
  key: 'q5'
}, {
  left: '支配的',
  right: '顺从的',
  key: 'q6'
}, {
  left: '残忍的',
  right: '高兴的',
  key: 'q7'
}, {
  left: '感兴趣的',
  right: '放松的',
  key: 'q8'
}, {
  left: '被引导的',
  right: '自主的',
  key: 'q9'
}, {
  left: '兴奋的',
  right: '激怒的',
  key: 'q10'
}, {
  left: '放松的',
  right: '充满希望的',
  key: 'q11'
}, {
  left: '有影响力的',
  right: '被影响的',
  key: 'q12'
}];
export default function PademotionMeasurement(props) {
  const [currentStep, setCurrentStep] = useState('info');
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'male'
  });
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [viewingHistory, setViewingHistory] = useState(null);

  // 使用 localStorage 存储所有数据
  useEffect(() => {
    const savedHistory = localStorage.getItem('pad_emotion_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);
  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const validateUserInfo = () => {
    if (!userInfo.name.trim()) {
      alert('请输入姓名');
      return false;
    }
    if (!userInfo.phone.trim() || !/^1[3-9]\d{9}$/.test(userInfo.phone)) {
      alert('请输入正确的手机号');
      return false;
    }
    if (!userInfo.age || userInfo.age < 1 || userInfo.age > 120) {
      alert('请输入正确的年龄');
      return false;
    }
    return true;
  };
  const handleAnswerChange = (questionKey, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: value[0]
    }));
  };
  const calculatePAD = () => {
    const q = answers;
    const P = ((q.q1 || 0) - (q.q4 || 0) + (q.q7 || 0) - (q.q10 || 0)) / 4;
    const A = (-(q.q2 || 0) + (q.q5 || 0) - (q.q8 || 0) + (q.q11 || 0)) / 4;
    const D = ((q.q3 || 0) - (q.q6 || 0) + (q.q9 || 0) - (q.q12 || 0)) / 4;
    return {
      P: Math.round(P * 100) / 100,
      A: Math.round(A * 100) / 100,
      D: Math.round(D * 100) / 100
    };
  };
  const handleSubmit = () => {
    // 允许0分直接提交，不再检查是否已回答
    const pad = calculatePAD();
    const match = calculateDistance(pad);
    const newResult = {
      ...userInfo,
      answers,
      pad,
      match,
      timestamp: new Date().toISOString()
    };
    const newHistory = [newResult, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('pad_emotion_history', JSON.stringify(newHistory));
    setResult(newResult);
    setCurrentStep('result');
  };
  const resetTest = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setCurrentStep('info');
  };
  const handleCancelTest = () => {
    setShowCancelDialog(true);
  };
  const confirmCancel = () => {
    // 清除当前所有问答结果
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setCurrentStep('info');
    setShowCancelDialog(false);
  };
  const cancelCancel = () => {
    setShowCancelDialog(false);
  };
  const calculateDistance = pad => {
    let minDistance = Infinity;
    let closestEmotion = null;
    EMOTIONS.forEach(emotion => {
      const distance = Math.sqrt(Math.pow(pad.P - emotion.P, 2) + Math.pow(pad.A - emotion.A, 2) + Math.pow(pad.D - emotion.D, 2));
      if (distance < minDistance) {
        minDistance = distance;
        closestEmotion = emotion;
      }
    });
    return {
      emotion: closestEmotion,
      distance: Math.round(minDistance * 100) / 100
    };
  };

  // 查看历史记录详情
  const viewHistoryDetail = historyItem => {
    setViewingHistory(historyItem);
    setResult(historyItem);
    setCurrentStep('result');
  };

  // 删除历史记录功能
  const handleDeleteHistory = index => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };
  const confirmDelete = () => {
    const newHistory = history.filter((_, index) => index !== deleteIndex);
    setHistory(newHistory);
    localStorage.setItem('pad_emotion_history', JSON.stringify(newHistory));
    setShowDeleteDialog(false);
    setDeleteIndex(null);
    if (viewingHistory && deleteIndex !== null) {
      const deletedItem = history[deleteIndex];
      if (viewingHistory.timestamp === deletedItem.timestamp) {
        setViewingHistory(null);
        setCurrentStep('history');
      }
    }
  };
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteIndex(null);
  };
  const renderInfoForm = () => <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardTitle className="text-xl">请填写您的基本信息开始测评</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">姓名 *</Label>
          <Input id="name" value={userInfo.name} onChange={e => handleUserInfoChange('name', e.target.value)} placeholder="请输入您的姓名" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-medium">手机号 *</Label>
          <Input id="phone" type="tel" value={userInfo.phone} onChange={e => handleUserInfoChange('phone', e.target.value)} placeholder="请输入手机号" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="age" className="text-sm font-medium">年龄 *</Label>
          <Input id="age" type="number" value={userInfo.age} onChange={e => handleUserInfoChange('age', parseInt(e.target.value) || '')} placeholder="请输入年龄" min="1" max="120" className="mt-1" />
        </div>
        <div>
          <Label className="text-sm font-medium">性别</Label>
          <RadioGroup value={userInfo.gender} onValueChange={value => handleUserInfoChange('gender', value)} className="flex space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="cursor-pointer">男</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="cursor-pointer">女</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Button onClick={() => {
          if (validateUserInfo()) {
            setCurrentStep('questions');
          }
        }} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            开始测评
          </Button>
          
          {history.length > 0 && <Button onClick={() => setCurrentStep('history')} variant="outline" className="w-full flex items-center justify-center">
              <History className="w-4 h-4 mr-2" />
              查看历史记录 ({history.length})
            </Button>}
        </div>
      </CardContent>
    </Card>;
  const renderQuestion = index => {
    const question = QUESTIONS[index];
    const value = answers[question.key] || 0;
    return <div className="w-full max-w-md mx-auto">
        {/* 右上角取消按钮 - 不突兀的样式 */}
        <div className="flex justify-end mb-2">
          <Button onClick={handleCancelTest} variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 hover:bg-red-50 flex items-center transition-colors">
            <XCircle className="w-4 h-4 mr-1" />
            取消
          </Button>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardTitle className="text-xl">问题 {index + 1}/12</CardTitle>
            <CardDescription className="text-green-100">请选择您当前的情感倾向</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4 text-lg font-medium">
                <div className="text-red-600 bg-red-50 p-3 rounded-lg">{question.left}</div>
                <div className="text-green-600 bg-green-50 p-3 rounded-lg">{question.right}</div>
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {value < 0 ? question.left : value > 0 ? question.right : '中立'}
              </div>
            </div>
            
            <div className="space-y-4">
              <Slider value={[value]} onValueChange={value => handleAnswerChange(question.key, value)} min={-4} max={4} step={0.1} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="text-red-600">-4 ({question.left})</span>
                <span className="text-gray-600">0 (中立)</span>
                <span className="text-green-600">4 ({question.right})</span>
              </div>
            </div>
            
            <div className="text-center">
              <Badge variant={value === 0 ? "secondary" : value > 0 ? "default" : "destructive"} className="text-lg px-4 py-2">
                评分: {value.toFixed(1)}
              </Badge>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))} disabled={currentQuestion === 0} className="flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一题
              </Button>
              
              {currentQuestion === 11 ? <Button onClick={handleSubmit} className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  提交结果
                </Button> : <Button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  下一题
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>}
            </div>
          </CardContent>
        </Card>
      </div>;
  };
  const renderResult = () => {
    if (!result) return null;
    const isViewingHistory = viewingHistory !== null;
    return <div className="space-y-4 w-full max-w-md mx-auto">
        {/* 用户信息卡片 */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50 py-3">
            <CardTitle className="text-base font-medium text-gray-700">用户信息</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
              <div><span className="text-gray-500">姓名：</span>{result.name}</div>
              <div><span className="text-gray-500">年龄：</span>{result.age}岁</div>
              <div><span className="text-gray-500">性别：</span>{result.gender === 'male' ? '男' : '女'}</div>
              <div><span className="text-gray-500">手机：</span>{result.phone}</div>
            </div>
            <div className="mt-2 pt-2 border-t text-sm text-gray-500">
              测试时间：{new Date(result.timestamp).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        {/* PAD维度展示 */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="text-xl">PAD维度分析</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{result.pad.P.toFixed(1)}</div>
                <div className="text-xs sm:text-sm text-blue-800 font-medium">愉悦度(P)</div>
                <div className="text-xs text-blue-600 mt-1">
                  {result.pad.P > 0 ? '积极' : result.pad.P < 0 ? '消极' : '中性'}
                </div>
              </div>
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
                <div className="text-xl sm:text-2xl font-bold text-green-600">{result.pad.A.toFixed(1)}</div>
                <div className="text-xs sm:text-sm text-green-800 font-medium">激活度(A)</div>
                <div className="text-xs text-green-600 mt-1">
                  {result.pad.A > 0 ? '高唤醒' : result.pad.A < 0 ? '低唤醒' : '中等'}
                </div>
              </div>
              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{result.pad.D.toFixed(1)}</div>
                <div className="text-xs sm:text-sm text-purple-800 font-medium">支配度(D)</div>
                <div className="text-xs text-purple-600 mt-1">
                  {result.pad.D > 0 ? '高支配' : result.pad.D < 0 ? '低支配' : '平衡'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 匹配结果 */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white">
            <CardTitle className="text-xl">情感匹配结果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="text-center space-y-3 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 sm:p-6 rounded-lg">
              <div className="text-base sm:text-lg font-medium text-gray-700">最匹配的情感类型</div>
              <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{result.match.emotion.name}</div>
              <div className="text-sm text-gray-600">
                匹配度: {(100 - result.match.distance * 10).toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 雷达图可视化 */}
        <PADVisualization currentPAD={result.pad} matchedEmotion={result.match.emotion} />

        {/* 情感距离排名 - 可折叠 */}
        <EmotionDistanceRanking currentPAD={result.pad} emotions={EMOTIONS} />

        {/* 答题记录 - 可折叠 */}
        <CollapsibleSection title="答题记录">
          <QuestionHistory answers={result.answers} questions={QUESTIONS} />
        </CollapsibleSection>

        {/* 导出按钮 - 详情页只显示JSON */}
        <div className="flex justify-center">
          <ExportButtons data={result} type="single" showCSV={false} />
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
          {isViewingHistory ? <>
              <Button onClick={() => {
            setViewingHistory(null);
            setCurrentStep('history');
          }} variant="outline" className="flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回历史
              </Button>
              <Button onClick={resetTest} variant="outline" className="flex items-center justify-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新测试
              </Button>
            </> : <>
              <Button onClick={resetTest} variant="outline" className="flex items-center justify-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                重新测试
              </Button>
              <Button onClick={() => setCurrentStep('history')} variant="outline" className="flex items-center justify-center">
                <History className="w-4 h-4 mr-2" />
                查看历史
              </Button>
            </>}
        </div>
      </div>;
  };
  const renderHistory = () => <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardTitle className="text-xl">历史记录</CardTitle>
        <CardDescription className="text-indigo-100">您过往的测评记录</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="text-sm text-gray-600">
            共 {history.length} 条记录
          </div>
          {history.length > 0 && <ExportButtons data={history} type="multiple" />}
        </div>
        
        <ScrollArea className="h-96">
          {history.length === 0 ? <div className="text-center text-muted-foreground py-8">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>暂无历史记录</p>
              <p className="text-sm mt-2">完成一次测评后，记录将显示在这里</p>
            </div> : <div className="space-y-3">
              {history.map((item, index) => <Card key={index} className="p-3 sm:p-4 hover:shadow-md transition-shadow group cursor-pointer" onClick={() => viewHistoryDetail(item)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 text-sm sm:text-base">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        手机：{item.phone}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      <Badge variant="outline" className="bg-gradient-to-r from-purple-100 to-pink-100 text-xs sm:text-sm">
                        {item.match.emotion.name}
                      </Badge>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity p-1 sm:p-2" onClick={e => {
                  e.stopPropagation();
                  handleDeleteHistory(index);
                }}>
                        <Trash2 className="w-3 sm:w-4 h-3 sm:h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs sm:text-sm grid grid-cols-3 gap-1 sm:gap-2 text-center">
                    <div className="bg-blue-50 rounded px-1 sm:px-2 py-1">
                      <span className="text-blue-600 font-medium">P</span> {item.pad.P.toFixed(1)}
                    </div>
                    <div className="bg-green-50 rounded px-1 sm:px-2 py-1">
                      <span className="text-green-600 font-medium">A</span> {item.pad.A.toFixed(1)}
                    </div>
                    <div className="bg-purple-50 rounded px-1 sm:px-2 py-1">
                      <span className="text-purple-600 font-medium">D</span> {item.pad.D.toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    点击查看详情
                  </div>
                </Card>)}
            </div>}
        </ScrollArea>
        <Button onClick={() => setCurrentStep('info')} className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
          <Home className="w-4 h-4 mr-2" />
          返回首页
        </Button>
      </CardContent>
    </Card>;

  // 取消确认对话框
  const renderCancelDialog = () => <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
      <AlertDialogContent className="w-[90vw] max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>确认取消测评</AlertDialogTitle>
          <AlertDialogDescription>
            确定要取消当前测评吗？已填写的答案将被清除，需要重新开始。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelCancel}>继续测评</AlertDialogCancel>
          <AlertDialogAction onClick={confirmCancel} className="bg-red-600 hover:bg-red-700">
            确认取消
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;

  // 删除确认对话框
  const renderDeleteDialog = () => <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent className="w-[90vw] max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>确认删除</AlertDialogTitle>
          <AlertDialogDescription>
            确定要删除这条历史记录吗？此操作无法撤销。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelDelete}>取消</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
            确认删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>;
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-2 sm:p-4 flex flex-col">
      <div className="max-w-md mx-auto flex-1 flex flex-col w-full">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">PAD情感测量-小布康康</h1>
          <p className="text-sm sm:text-base text-gray-600">科学评估您的情感状态</p>
        </div>
        
        <div className="flex-1 w-full">
          {currentStep === 'info' && renderInfoForm()}
          {currentStep === 'questions' && renderQuestion(currentQuestion)}
          {currentStep === 'result' && renderResult()}
          {currentStep === 'history' && renderHistory()}
        </div>
        
        <div className="text-center mt-4 sm:mt-8 pb-2 sm:pb-4">
          <p className="text-xs sm:text-sm text-gray-500">小布康康 2025</p>
        </div>
        
        {renderCancelDialog()}
        {renderDeleteDialog()}
      </div>
    </div>;
}