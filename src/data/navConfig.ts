import {
  Home,
  TrendingUp,
  PackageCheck,
  GitPullRequestArrow,
  ClipboardList,
  HeartPulse,
  Users,
  Server,
  FlaskConical,
  Wallet,
  Award,
  Clock,
  ListChecks,
  ShieldCheck,
  Boxes,
  Landmark,
  Lightbulb,
  ArrowLeftRight,
  Star,
  UserCog,
  BellRing,
} from 'lucide-react'
import type { NavItem } from '@/types'

export const navItems: NavItem[] = [
  {
    id: 'home',
    title: '首页',
    items: [
      {
        id: 'overview',
        title: '首页',
        description: '统一掌握研发项目进度、质量、资源与风险',
        icon: Home,
      },
    ],
  },
  {
    id: 'project-management',
    title: '项目管理',
    items: [
      {
        id: 'project-progress',
        title: '项目进度',
        description: '查看项目整体进度、里程碑及延期情况',
        icon: TrendingUp,
      },
      {
        id: 'delivery-detail',
        title: '交付明细',
        description: '查看项目交付件和交付状态',
        icon: PackageCheck,
      },
      {
        id: 'ccb-change',
        title: 'CCB变更',
        description: '管理项目变更申请和审批流程',
        icon: GitPullRequestArrow,
      },
      {
        id: 'key-summary',
        title: '重点总结',
        description: '查看项目阶段性成果、风险和重点事项',
        icon: ClipboardList,
      },
      {
        id: 'jira-projects',
        title: '项目列表',
        description: '查看配置的项目清单，点击详情可查看任务排期',
        icon: Boxes,
      },
      {
        id: 'quality-health',
        title: '质量健康',
        description: '查看项目质量、缺陷和健康度',
        icon: HeartPulse,
      },
      {
        id: 'staff-investment',
        title: '人员投入',
        description: '查看项目人员配置和工作负荷',
        icon: Users,
      },
      {
        id: 'resource-usage',
        title: '资源占用',
        description: '查看服务器、EMU、EDA、IP等研发资源',
        icon: Server,
      },
      {
        id: 'svt-special',
        title: 'SVT专项',
        description: '查看SVT专项任务和执行情况',
        icon: FlaskConical,
      },
      {
        id: 'budget',
        title: '预算',
        description: '查看项目预算和费用执行情况',
        icon: Wallet,
      },
      {
        id: 'incentive',
        title: '激励',
        description: '管理项目和人员激励信息',
        icon: Award,
      },
    ],
  },
  {
    id: 'compliance',
    title: '合规内控',
    items: [
      {
        id: 'work-hours',
        title: '研发工时',
        description: '查看研发人员工时填报及异常情况',
        icon: Clock,
      },
      {
        id: 'project-list',
        title: '项目清单',
        description: '统一管理全部研发项目',
        icon: ListChecks,
      },
      {
        id: 'project-compliance',
        title: '项目合规',
        description: '检查交付件、时间和质量合规性',
        icon: ShieldCheck,
      },
      {
        id: 'material-tracking',
        title: '物料去向',
        description: '跟踪研发物料采购、领用和流转',
        icon: Boxes,
      },
      {
        id: 'gov-projects',
        title: '政府项目',
        description: '管理政府项目申报、执行和验收',
        icon: Landmark,
      },
      {
        id: 'achievements',
        title: '成果转化与保护',
        description: '管理专利、软著和研发成果',
        icon: Lightbulb,
      },
    ],
  },
  {
    id: 'system-config',
    title: '系统配置',
    items: [
      {
        id: 'field-mapping',
        title: '字段映射',
        description: '配置不同系统之间的数据字段映射',
        icon: ArrowLeftRight,
      },
      {
        id: 'focus-projects',
        title: '关注项目',
        description: '管理个人重点关注项目以及 Jira / Confluence 链接',
        icon: Star,
      },
      {
        id: 'staff-classification',
        title: '人员分类',
        description: '按照岗位和角色配置人员分类及权限',
        icon: UserCog,
      },
      {
        id: 'notification-config',
        title: '通知配置',
        description: '配置企业微信、邮件、系统消息等通知规则',
        icon: BellRing,
      },
    ],
  },
]
