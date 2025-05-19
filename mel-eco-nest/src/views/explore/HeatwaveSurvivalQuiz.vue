<template>
  <div class="quiz-container">
    <div class="quiz-header">
      <h1>Heatwave Survival Quiz</h1>
      <p>Test your knowledge about heatwave safety through real-life scenarios</p>
    </div>

    <div v-if="selectedScenario === null" class="scenario-selection">
      <h2>选择场景</h2>
      <div class="scenario-buttons">
        <button 
          v-for="(scenario, index) in scenarioList" 
          :key="index"
          @click="selectScenario(index)"
          class="scenario-button"
        >
          {{ scenario.title }}
        </button>
      </div>
    </div>

    <div class="scenario-container" v-else-if="!quizCompleted">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
        <span class="progress-text">题目 {{ currentScenario + 1 }} / {{ currentScenarioList.length }}</span>
      </div>

      <div class="scenario-content">
        <div class="scenario-header">
          <h2>{{ currentQuestion.title }}</h2>
          <p class="scenario-background">{{ currentQuestion.background }}</p>
        </div>

        <div class="options-container">
          <button
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            :class="['option-button', {
              'correct': showFeedback && option.isCorrect,
              'incorrect': showFeedback && !option.isCorrect && selectedOption === index,
              'warning': showFeedback && option.isWarning && selectedOption === index
            }]"
            @click="selectOption(index)"
            :disabled="showFeedback"
          >
            {{ option.text }}
          </button>
        </div>

        <div v-if="showFeedback" class="feedback-container">
          <div class="feedback-content">
            <div class="feedback-icon">
              <i :class="feedbackIcon"></i>
            </div>
            <p>{{ currentQuestion.options[selectedOption].feedback }}</p>
          </div>
          <button class="next-button" @click="nextScenario">
            {{ currentScenario === currentScenarioList.length - 1 ? '完成答题' : '下一题' }}
          </button>
        </div>
      </div>
    </div>

    <div v-else class="completion-container">
      <h2>答题完成！</h2>
      <p>你已完成所有题目。得分：{{ score }}/{{ currentScenarioList.length }}</p>
      <div class="completion-actions">
        <router-link to="/explore/heat-guide" class="return-button">
          返回指南
        </router-link>
        <button @click="restartQuiz" class="restart-button">
          再试一次
        </button>
        <button @click="returnToQuiz" class="return-quiz-button">
          返回 Heatwave Survival Quiz
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const scenarioList = [
  {
    title: "🌞 独居老人热浪生存指南",
    scenarios: [
      {
        title: "中午室内闷热时的应对",
        background: "现在是夏季中午，你是一位76岁的独居老人，室内感觉闷热。",
        options: [
          {
            text: "打开所有窗户通风",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 中午开窗会让热空气进入室内，反而会提高室内温度。"
          },
          {
            text: "关闭窗户，拉上窗帘，打开风扇",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！这样可以有效阻挡辐射热并促进空气流通。"
          },
          {
            text: "将空调温度调到16°C",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 温度设置过低可能导致身体不适，建议保持在24-26°C。"
          }
        ]
      },
      {
        title: "水分补充时机",
        background: "上午11点，你虽然不觉得口渴，但一直在出汗。",
        options: [
          {
            text: "等到口渴再喝水",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 老年人对口渴的感知可能减弱，等到口渴才喝水已经太晚了。"
          },
          {
            text: "主动补充水分",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！定期补充水分比等到口渴更安全。"
          },
          {
            text: "吃咸的食物代替喝水",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 咸食会增加身体对水分的需求，不能替代直接补充水分。"
          }
        ]
      },
      {
        title: "室内温度监测",
        background: "在出门前，你想确认家里的温度是否安全。",
        options: [
          {
            text: "用手触摸墙壁或地板感受温度",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 主观感受不够准确，无法准确判断室内温度。"
          },
          {
            text: "使用温湿度计测量",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！使用专业设备可以准确监测室内温湿度。"
          },
          {
            text: "通过观察室外阳光和天空判断",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 室外天气状况不能准确反映室内温度。"
          }
        ]
      },
      {
        title: "中暑症状识别",
        background: "在炎热的下午，你感到头晕，皮肤干燥发烫。",
        options: [
          {
            text: "可能是感冒了",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 这些症状更可能是中暑的早期征兆。"
          },
          {
            text: "这是中暑的警告信号",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！头晕和皮肤干燥发烫是中暑的早期症状，需要立即采取降温措施。"
          },
          {
            text: "只是消化不良，观察一下",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 这些症状与消化无关，需要立即关注。"
          }
        ]
      },
      {
        title: "紧急情况处理",
        background: "你独自在家，开始感到意识模糊。",
        options: [
          {
            text: "用湿毛巾敷着躺下休息",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 意识模糊是严重症状，需要立即就医。"
          },
          {
            text: "立即拨打急救电话并开始降温",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！意识模糊是严重中暑症状，需要立即就医。"
          },
          {
            text: "喝冰水等待好转",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 冰水可能刺激肠胃，且意识模糊时不宜自行处理。"
          }
        ]
      }
    ]
  },
  {
    title: "👨‍👩‍👧 家庭儿童热浪防护",
    scenarios: [
      {
        title: "儿童户外活动安排",
        background: "你正在照顾9岁的孩子，现在是热浪期间。孩子想出去踢足球。",
        options: [
          {
            text: "给他一瓶水就让他出去",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 即使有水，在高温下运动也可能导致中暑。"
          },
          {
            text: "建议等到傍晚再出去",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！傍晚温度较低，更适合户外活动。"
          },
          {
            text: "允许他去，但要求30分钟后回来",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 30分钟在高温下仍然存在风险，最好选择更凉爽的时间段。"
          }
        ]
      },
      {
        title: "室内温度管理",
        background: "室内温度达到32°C，需要采取措施。",
        options: [
          {
            text: "打开窗户通风",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 当室外温度更高时，开窗会让热空气进入。"
          },
          {
            text: "关闭窗户并拉上窗帘",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！这样可以阻挡热空气进入和阳光直射。"
          },
          {
            text: "只依靠自然风",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 在热浪期间，自然风可能也是热的，需要采取更积极的降温措施。"
          }
        ]
      },
      {
        title: "儿童睡眠环境",
        background: "在没有空调的公寓里，孩子盖着厚被子午睡。",
        options: [
          {
            text: "换成薄床单",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！使用透气性好的薄床单更适合高温天气。"
          },
          {
            text: "保持现状",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 厚被子会增加体温，不利于散热。"
          },
          {
            text: "将风扇直接对着孩子吹",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 直接对着孩子吹风扇可能导致着凉或不适。"
          }
        ]
      },
      {
        title: "儿童热应激症状",
        background: "孩子出现头痛、口干和烦躁的症状。",
        options: [
          {
            text: "给他喝水，让他休息并降温",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！这些是脱水和热应激的早期症状，需要及时处理。"
          },
          {
            text: "让他喝果汁并观察",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 果汁含糖量高，不利于补充水分。"
          },
          {
            text: "给他吃感冒药",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 这些症状与感冒无关，是热应激的表现。"
          }
        ]
      },
      {
        title: "户外活动时间选择",
        background: "你正在计划一次户外活动。",
        options: [
          {
            text: "中午12点左右",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 中午是一天中最热的时候，不适合户外活动。"
          },
          {
            text: "下午4点",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 下午4点温度仍然较高。"
          },
          {
            text: "早上7-9点之间",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！早晨温度最低，紫外线强度也较低。"
          }
        ]
      }
    ]
  },
  {
    title: "👷 户外工作者热浪防护",
    scenarios: [
      {
        title: "水分补充管理",
        background: "你是一名道路施工工人，需要在高温下工作。",
        options: [
          {
            text: "只在口渴时喝水",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 等到口渴才喝水已经太晚了，应该定期补充水分。"
          },
          {
            text: "每小时定期喝水",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！定时补充水分是预防中暑的关键。"
          },
          {
            text: "用能量饮料代替水",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 能量饮料可能影响水分吸收，应该以清水为主。"
          }
        ]
      },
      {
        title: "工作着装选择",
        background: "你准备穿着浅色长袖、帽子和太阳镜工作。",
        options: [
          {
            text: "这样的着装合适",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！这样的着装既能防晒又能保持通风。"
          },
          {
            text: "太热了，应该脱掉上衣",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 暴露皮肤会增加晒伤和中暑风险。"
          },
          {
            text: "太阳镜是多余的",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 太阳镜可以保护眼睛，是必要的防护装备。"
          }
        ]
      },
      {
        title: "休息场所选择",
        background: "你决定在停放的卡车里休息。",
        options: [
          {
            text: "这是安全的",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 封闭的车辆内部温度可能超过50°C，非常危险。"
          },
          {
            text: "不安全，车内温度可能致命",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！应该选择阴凉通风的地方休息。"
          },
          {
            text: "开窗就安全",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 即使开窗，车内温度仍然可能很高。"
          }
        ]
      },
      {
        title: "热应激症状处理",
        background: "你开始感到头晕和恶心。",
        options: [
          {
            text: "继续工作",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 继续工作可能加重症状，导致严重后果。"
          },
          {
            text: "立即休息，降温并补充水分",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！这些是中暑的早期症状，需要立即处理。"
          },
          {
            text: "吃点东西感觉会好",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 这些症状与饥饿无关，是热应激的表现。"
          }
        ]
      },
      {
        title: "同事中暑处理",
        background: "一位同事晕倒，皮肤干燥发烫。",
        options: [
          {
            text: "泼水并试图叫醒他",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 这些措施不足以处理严重中暑。"
          },
          {
            text: "拨打急救电话并开始表面降温",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！严重中暑需要立即就医和降温处理。"
          },
          {
            text: "快速给他喝水",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 意识不清时不宜强行喂水，可能造成窒息。"
          }
        ]
      }
    ]
  },
  {
    title: "🧑‍🏫 学校热浪安全指南",
    scenarios: [
      {
        title: "体育课时间安排",
        background: "你是一名学校教师，需要安排户外体育活动。",
        options: [
          {
            text: "上午10点前",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！早晨温度较低，紫外线强度也较低。"
          },
          {
            text: "中午12点",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 中午是一天中最热的时候，不适合户外活动。"
          },
          {
            text: "下午3:30",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 下午温度仍然较高，建议选择更早的时间。"
          }
        ]
      },
      {
        title: "学生着装建议",
        background: "学生穿着标准校服，需要额外的防护建议。",
        options: [
          {
            text: "穿深色衣服防晒",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 深色衣服会吸收更多热量。"
          },
          {
            text: "戴帽子并穿浅色衣服",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！浅色衣服反射热量，帽子提供防晒保护。"
          },
          {
            text: "多喝软饮料",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 软饮料含糖量高，不利于补充水分。"
          }
        ]
      },
      {
        title: "学生热应激处理",
        background: "学生出现头痛、脸红和心跳加快的症状。",
        options: [
          {
            text: "让他躺下休息，降温并通知校医",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！这些是热应激的症状，需要专业医疗人员处理。"
          },
          {
            text: "让他在教室休息",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 这些症状需要及时处理，不能简单休息。"
          },
          {
            text: "打电话让家长接走",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 应该先进行初步处理，再决定是否需要送医。"
          }
        ]
      },
      {
        title: "教室安全措施",
        background: "在热浪期间确保教室安全。",
        options: [
          {
            text: "鼓励定时补充水分",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！定时补充水分比等到口渴更有效。"
          },
          {
            text: "分发冰淇淋",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 冰淇淋不能替代水分补充，且可能影响食欲。"
          },
          {
            text: "保持正常教学节奏",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 热浪期间需要调整教学安排，关注学生状态。"
          }
        ]
      },
      {
        title: "热浪期间学校调整",
        background: "学校收到热浪预警，需要做出调整。",
        options: [
          {
            text: "推迟放学时间",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 推迟放学可能让学生暴露在高温中更长时间。"
          },
          {
            text: "缩短户外课程时间",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！减少户外活动时间可以降低热相关疾病风险。"
          },
          {
            text: "不做任何改变",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 热浪期间需要采取预防措施保护学生安全。"
          }
        ]
      }
    ]
  },
  {
    title: "🧑‍⚕️ 居家护理热浪应急",
    scenarios: [
      {
        title: "糖尿病患者症状识别",
        background: "你是一名护理人员，正在照顾一位老年糖尿病患者。",
        options: [
          {
            text: "只是脱水",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 这些症状可能表明更严重的热应激反应。"
          },
          {
            text: "可能是中暑或热衰竭",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！这些是严重热应激的征兆，需要立即采取降温措施。"
          },
          {
            text: "情绪激动",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 这些症状与情绪无关，需要立即关注。"
          }
        ]
      },
      {
        title: "紧急情况处理",
        background: "发现患者出现热应激症状。",
        options: [
          {
            text: "打开窗户通风",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 仅通风不足以处理热应激。"
          },
          {
            text: "开始降温并检查意识水平",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！物理降温和意识状态检查是关键。"
          },
          {
            text: "让他休息并喝水",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 这些症状需要更积极的处理措施。"
          }
        ]
      },
      {
        title: "药物副作用处理",
        background: "患者服药后出汗减少。",
        options: [
          {
            text: "继续观察",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 需要检查药物是否影响排汗功能。"
          },
          {
            text: "检查药物副作用",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！某些药物可能抑制排汗，需要评估。"
          },
          {
            text: "吃降火食物",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 食物不能解决药物副作用问题。"
          }
        ] 
      },
      {
        title: "夜间温度控制",
        background: "需要确定安全的夜间室温。",
        options: [
          {
            text: "28°C",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 28°C对老年人来说仍然太高。"
          },
          {
            text: "≤24°C",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！夜间温度应保持在24°C以下以确保安全。"
          },
          {
            text: "只要开风扇就行",
            isCorrect: false,
            isWarning: true,
            feedback: "⚠️ 仅靠风扇可能不足以维持安全温度。"
          }
        ]
      },
      {
        title: "严重症状处理",
        background: "患者出现意识模糊和言语不清。",
        options: [
          {
            text: "强迫他喝水",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 意识不清时不宜强行喂水。"
          },
          {
            text: "涂抹清凉油",
            isCorrect: false,
            isWarning: false,
            feedback: "❌ 这些症状需要专业医疗处理。"
          },
          {
            text: "立即拨打急救电话",
            isCorrect: true,
            isWarning: false,
            feedback: "✅ 正确！这些是严重中暑的神经症状，需要立即就医。"
          }
        ]
      }
    ]
  }
]

const selectedScenario = ref(null)
const currentScenario = ref(0)
const selectedOption = ref(null)
const showFeedback = ref(false)
const quizCompleted = ref(false)
const score = ref(0)

// 取当前场景的题目数组
const currentScenarioList = computed(() => {
  if (selectedScenario.value !== null) {
    return scenarioList[selectedScenario.value].scenarios
  }
  return []
})

// 取当前题目
const currentQuestion = computed(() => {
  return currentScenarioList.value[currentScenario.value]
})

const progressPercentage = computed(() => {
  return currentScenarioList.value.length > 0
    ? ((currentScenario.value + 1) / currentScenarioList.value.length) * 100
    : 0
})

const feedbackIcon = computed(() => {
  if (!currentQuestion.value || selectedOption.value === null) return ''
  const option = currentQuestion.value.options[selectedOption.value]
  if (option.isCorrect) return 'fas fa-check-circle'
  if (option.isWarning) return 'fas fa-exclamation-triangle'
  return 'fas fa-times-circle'
})

const selectScenario = (index) => {
  selectedScenario.value = index
  currentScenario.value = 0
  selectedOption.value = null
  showFeedback.value = false
  quizCompleted.value = false
  score.value = 0
}

const selectOption = (index) => {
  selectedOption.value = index
  showFeedback.value = true
  if (currentQuestion.value.options[index].isCorrect) {
    score.value++
  }
}

const nextScenario = () => {
  if (currentScenario.value < currentScenarioList.value.length - 1) {
    currentScenario.value++
    selectedOption.value = null
    showFeedback.value = false
  } else {
    quizCompleted.value = true
  }
}

const restartQuiz = () => {
  currentScenario.value = 0
  selectedOption.value = null
  showFeedback.value = false
  quizCompleted.value = false
  score.value = 0
}

const returnToQuiz = () => {
  selectedScenario.value = null
  currentScenario.value = 0
  selectedOption.value = null
  showFeedback.value = false
  quizCompleted.value = false
  score.value = 0
}
</script>

<style scoped>
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.quiz-header {
  text-align: center;
  margin-bottom: 40px;
}

.quiz-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.quiz-header p {
  font-size: 1.2rem;
  color: #666;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #e9ecef;
  border-radius: 5px;
  margin-bottom: 30px;
  position: relative;
}

.progress {
  height: 100%;
  background-color: #0d6efd;
  border-radius: 5px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: -25px;
  right: 0;
  font-size: 0.9rem;
  color: #666;
}

.scenario-content {
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.scenario-header {
  margin-bottom: 30px;
}

.scenario-header h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
}

.scenario-background {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.option-button {
  padding: 20px;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  background-color: white;
  font-size: 1.1rem;
  color: #333;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-button:hover:not(:disabled) {
  border-color: #0d6efd;
  background-color: #f8f9fa;
}

.option-button.correct {
  background-color: #d4edda;
  border-color: #28a745;
  color: #155724;
}

.option-button.incorrect {
  background-color: #f8d7da;
  border-color: #dc3545;
  color: #721c24;
}

.option-button.warning {
  background-color: #fff3cd;
  border-color: #ffc107;
  color: #856404;
}

.feedback-container {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.feedback-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.feedback-icon {
  font-size: 1.5rem;
}

.feedback-icon .fa-check-circle {
  color: #28a745;
}

.feedback-icon .fa-times-circle {
  color: #dc3545;
}

.feedback-icon .fa-exclamation-triangle {
  color: #ffc107;
}

.next-button {
  width: 100%;
  padding: 15px;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.next-button:hover {
  background-color: #0b5ed7;
}

.completion-container {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.completion-container h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
}

.completion-container p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.completion-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.return-button,
.restart-button {
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.return-button {
  background-color: #6c757d;
  color: white;
  text-decoration: none;
}

.return-button:hover {
  background-color: #5a6268;
}

.restart-button {
  background-color: #0d6efd;
  color: white;
  border: none;
}

.restart-button:hover {
  background-color: #0b5ed7;
}

.scenario-selection {
  text-align: center;
  padding: 20px;
}

.scenario-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.scenario-button {
  padding: 20px;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  background-color: white;
  font-size: 1.1rem;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scenario-button:hover {
  border-color: #0d6efd;
  background-color: #f8f9fa;
  transform: translateY(-2px);
}

.return-quiz-button {
  background-color: #6c757d;
  color: white;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;
}

.return-quiz-button:hover {
  background-color: #5a6268;
}

@media (max-width: 576px) {
  .quiz-container {
    padding: 20px;
  }

  .quiz-header h1 {
    font-size: 2rem;
  }

  .scenario-header h2 {
    font-size: 1.5rem;
  }

  .option-button {
    padding: 15px;
  }

  .completion-actions {
    flex-direction: column;
  }

  .scenario-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
