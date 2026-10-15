import {
  FolderKanban,
  Activity,
  AlertTriangle,
  Flag,
  Users,
  UserCheck,
  UserX,
  Gauge,
  PackageCheck,
  GitPullRequestArrow,
  ClipboardList,
  HeartPulse,
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
  UserCog,
  BellRing,
} from 'lucide-react'
import type {
  MetricCardData,
  TrendSeries,
  RiskItem,
  Project,
  StaffLoadRow,
  FocusProject,
  GenericPageConfig,
  TableColumn,
} from '@/types'
import ProgressBar from '@/components/common/ProgressBar'
import StatusBadge from '@/components/common/StatusBadge'
import { Badge } from '@/components/ui/badge'

/* -------------------------------------------------------------------------- */
/* 项目总览                                                                     */
/* -------------------------------------------------------------------------- */

export const overviewKpis: MetricCardData[] = [
  {
    id: 'total-projects',
    label: '项目总数',
    value: '42',
    sublabel: '较上月 +3',
    icon: FolderKanban,
    trend: [20, 22, 24, 23, 26, 28, 30, 29, 31, 33, 35, 42],
    trendColor: 'primary',
  },
  {
    id: 'in-progress',
    label: '进行中',
    value: '26',
    sublabel: '占比 61.9%',
    icon: Activity,
    trend: [14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    trendColor: 'primary',
  },
  {
    id: 'risk-projects',
    label: '风险项目',
    value: '5',
    sublabel: '需重点关注',
    icon: AlertTriangle,
    trend: [2, 3, 2, 4, 3, 5, 4, 5, 6, 5, 4, 5],
    trendColor: 'danger',
  },
  {
    id: 'month-milestones',
    label: '本月里程碑',
    value: '18',
    sublabel: '较上月 +4',
    icon: Flag,
    trend: [10, 11, 9, 12, 13, 12, 14, 15, 14, 16, 17, 18],
    trendColor: 'success',
  },
]

export const overviewCompletionRate = 68

export const overviewStatusDistribution = [
  { label: '正常', value: 21, colorVar: 'hsl(var(--success))' },
  { label: '预警', value: 5, colorVar: 'hsl(var(--warning))' },
  { label: '延期', value: 3, colorVar: 'hsl(var(--danger))' },
  { label: '已完成', value: 13, colorVar: 'hsl(var(--muted-foreground))' },
]

export const overviewTrendData = [
  { month: '1月', planned: 15, actual: 12 },
  { month: '2月', planned: 28, actual: 24 },
  { month: '3月', planned: 42, actual: 36 },
  { month: '4月', planned: 55, actual: 50 },
  { month: '5月', planned: 70, actual: 61 },
  { month: '6月', planned: 82, actual: 68 },
]

export const overviewTrendSeries: TrendSeries[] = [
  { key: 'planned', name: '计划进度', color: 'hsl(var(--primary))' },
  { key: 'actual', name: '实际进度', color: 'hsl(var(--success))' },
]

export const overviewRisks: RiskItem[] = [
  { id: 'r1', project: 'XX芯片项目', issue: '交付延期 7 天', level: 'high' },
  { id: 'r2', project: 'YY平台项目', issue: 'EDA资源不足', level: 'medium' },
  { id: 'r3', project: 'ZZ验证项目', issue: '人员投入不足', level: 'medium' },
]

export const keyProjects: Project[] = [
  {
    id: 'p1',
    name: 'XX芯片项目',
    owner: '张伟',
    stage: '样片验证',
    plannedProgress: 72,
    actualProgress: 58,
    nextMilestone: '流片评审',
    health: 'risk',
  },
  {
    id: 'p2',
    name: 'YY平台项目',
    owner: '李娜',
    stage: '系统集成',
    plannedProgress: 60,
    actualProgress: 55,
    nextMilestone: '联调测试',
    health: 'warning',
  },
  {
    id: 'p3',
    name: 'ZZ验证项目',
    owner: '王强',
    stage: '功能验证',
    plannedProgress: 45,
    actualProgress: 40,
    nextMilestone: 'SVT专项启动',
    health: 'warning',
  },
  {
    id: 'p4',
    name: '云端调度平台',
    owner: '赵敏',
    stage: '需求设计',
    plannedProgress: 30,
    actualProgress: 30,
    nextMilestone: '架构评审',
    health: 'normal',
  },
  {
    id: 'p5',
    name: '智能网关 V2',
    owner: '陈曦',
    stage: '量产准备',
    plannedProgress: 95,
    actualProgress: 95,
    nextMilestone: '量产发布',
    health: 'done',
  },
  {
    id: 'p6',
    name: '数据中台重构',
    owner: '刘洋',
    stage: '开发中',
    plannedProgress: 50,
    actualProgress: 48,
    nextMilestone: '接口联调',
    health: 'normal',
  },
  {
    id: 'p7',
    name: '低功耗IP复用',
    owner: '孙芳',
    stage: '设计评审',
    plannedProgress: 38,
    actualProgress: 22,
    nextMilestone: '设计定案',
    health: 'risk',
  },
]

export const keyProjectColumns: TableColumn<Project>[] = [
  { key: 'name', header: '项目名称' },
  { key: 'owner', header: '负责人' },
  { key: 'stage', header: '项目阶段' },
  {
    key: 'plannedProgress',
    header: '计划进度',
    render: (row) => <ProgressBar value={row.plannedProgress} showLabel className="w-32" />,
  },
  {
    key: 'actualProgress',
    header: '实际进度',
    render: (row) => (
      <ProgressBar
        value={row.actualProgress}
        showLabel
        className="w-32"
        colorClassName={row.actualProgress < row.plannedProgress ? 'bg-warning' : 'bg-success'}
      />
    ),
  },
  { key: 'nextMilestone', header: '下一里程碑' },
  {
    key: 'health',
    header: '健康状态',
    align: 'center',
    render: (row) => <StatusBadge status={row.health} />,
  },
]

/* -------------------------------------------------------------------------- */
/* 项目进度                                                                     */
/* -------------------------------------------------------------------------- */

export const projectProgressKpis: MetricCardData[] = [
  {
    id: 'pp-total',
    label: '在研项目数',
    value: '26',
    sublabel: '覆盖 5 个产品线',
    icon: FolderKanban,
    trend: [18, 19, 20, 21, 22, 24, 25, 24, 25, 26, 26, 26],
    trendColor: 'primary',
  },
  {
    id: 'pp-avg',
    label: '平均完成率',
    value: '64%',
    sublabel: '较上月 +5pt',
    icon: Gauge,
    trend: [40, 44, 48, 50, 53, 55, 57, 58, 60, 61, 63, 64],
    trendColor: 'primary',
  },
  {
    id: 'pp-delay',
    label: '延期项目数',
    value: '4',
    sublabel: '占比 15.4%',
    icon: AlertTriangle,
    trend: [1, 2, 2, 3, 2, 3, 4, 3, 4, 3, 4, 4],
    trendColor: 'danger',
  },
  {
    id: 'pp-milestone',
    label: '里程碑达成率',
    value: '89%',
    sublabel: '本季度累计',
    icon: Flag,
    trend: [70, 72, 75, 78, 80, 82, 84, 85, 86, 87, 88, 89],
    trendColor: 'success',
  },
]

export const projectProgressTrendData = [
  { month: '1月', planned: 12, actual: 10 },
  { month: '2月', planned: 24, actual: 20 },
  { month: '3月', planned: 38, actual: 33 },
  { month: '4月', planned: 50, actual: 45 },
  { month: '5月', planned: 63, actual: 56 },
  { month: '6月', planned: 76, actual: 64 },
]

/* -------------------------------------------------------------------------- */
/* 人员投入                                                                     */
/* -------------------------------------------------------------------------- */

export const staffInvestmentKpis: MetricCardData[] = [
  {
    id: 'staff-total',
    label: '总人员数',
    value: '186',
    sublabel: '覆盖 42 个项目',
    icon: Users,
    trend: [160, 164, 168, 170, 174, 178, 180, 182, 183, 184, 185, 186],
    trendColor: 'primary',
  },
  {
    id: 'staff-active',
    label: '当前投入人数',
    value: '152',
    sublabel: '在研项目投入',
    icon: UserCheck,
    trend: [120, 126, 130, 134, 138, 140, 143, 146, 148, 149, 150, 152],
    trendColor: 'success',
  },
  {
    id: 'staff-overload',
    label: '超负荷人数',
    value: '13',
    sublabel: '投入率 > 100%',
    icon: UserX,
    trend: [4, 5, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13],
    trendColor: 'danger',
  },
]

export const staffInvestmentTrendData = [
  { month: '1月', invested: 128 },
  { month: '2月', invested: 134 },
  { month: '3月', invested: 140 },
  { month: '4月', invested: 145 },
  { month: '5月', invested: 149 },
  { month: '6月', invested: 152 },
]

export const staffInvestmentTrendSeries: TrendSeries[] = [
  { key: 'invested', name: '投入人数', color: 'hsl(var(--primary))' },
]

export const staffProjectDistribution = [
  { project: 'XX芯片项目', count: 32 },
  { project: 'YY平台项目', count: 24 },
  { project: 'ZZ验证项目', count: 19 },
  { project: '云端调度平台', count: 15 },
  { project: '智能网关 V2', count: 12 },
]

export const staffLoadRows: StaffLoadRow[] = [
  { id: 's1', name: '张伟', role: '芯片设计工程师', project: 'XX芯片项目', allocation: 120, status: 'overload' },
  { id: 's2', name: '李娜', role: '系统架构师', project: 'YY平台项目', allocation: 95, status: 'normal' },
  { id: 's3', name: '王强', role: '验证工程师', project: 'ZZ验证项目', allocation: 110, status: 'overload' },
  { id: 's4', name: '赵敏', role: '产品经理', project: '云端调度平台', allocation: 80, status: 'normal' },
  { id: 's5', name: '陈曦', role: '硬件工程师', project: '智能网关 V2', allocation: 70, status: 'normal' },
  { id: 's6', name: '刘洋', role: '后端工程师', project: '数据中台重构', allocation: 105, status: 'overload' },
]

export const staffLoadColumns: TableColumn<StaffLoadRow>[] = [
  { key: 'name', header: '姓名' },
  { key: 'role', header: '岗位' },
  { key: 'project', header: '所属项目' },
  {
    key: 'allocation',
    header: '投入率',
    render: (row) => (
      <ProgressBar
        value={Math.min(row.allocation, 100)}
        className="w-32"
        colorClassName={row.allocation > 100 ? 'bg-danger' : 'bg-primary'}
      />
    ),
  },
  {
    key: 'allocationValue',
    header: '数值',
    align: 'right',
    render: (row) => <span className="font-medium">{row.allocation}%</span>,
  },
  {
    key: 'status',
    header: '状态',
    align: 'center',
    render: (row) =>
      row.status === 'overload' ? (
        <Badge variant="danger">超负荷</Badge>
      ) : (
        <Badge variant="success">正常</Badge>
      ),
  },
]

/* -------------------------------------------------------------------------- */
/* 关注项目                                                                     */
/* -------------------------------------------------------------------------- */

export const focusProjects: FocusProject[] = [
  {
    id: 'f1',
    name: 'XX芯片项目',
    progress: 58,
    owner: '张伟',
    jiraUrl: 'https://jira.example.com/projects/XX',
    confluenceUrl: 'https://confluence.example.com/display/XX',
    health: 'risk',
  },
  {
    id: 'f2',
    name: 'YY平台项目',
    progress: 55,
    owner: '李娜',
    jiraUrl: 'https://jira.example.com/projects/YY',
    confluenceUrl: 'https://confluence.example.com/display/YY',
    health: 'warning',
  },
  {
    id: 'f3',
    name: '智能网关 V2',
    progress: 95,
    owner: '陈曦',
    jiraUrl: 'https://jira.example.com/projects/GW2',
    confluenceUrl: 'https://confluence.example.com/display/GW2',
    health: 'done',
  },
  {
    id: 'f4',
    name: '数据中台重构',
    progress: 48,
    owner: '刘洋',
    jiraUrl: 'https://jira.example.com/projects/DP',
    confluenceUrl: 'https://confluence.example.com/display/DP',
    health: 'normal',
  },
  {
    id: 'f5',
    name: '云端调度平台',
    progress: 30,
    owner: '赵敏',
    jiraUrl: 'https://jira.example.com/projects/CS',
    confluenceUrl: 'https://confluence.example.com/display/CS',
    health: 'normal',
  },
  {
    id: 'f6',
    name: '低功耗IP复用',
    progress: 22,
    owner: '孙芳',
    jiraUrl: 'https://jira.example.com/projects/IP',
    confluenceUrl: 'https://confluence.example.com/display/IP',
    health: 'risk',
  },
]

/* -------------------------------------------------------------------------- */
/* 其余子菜单页面（通用模板 GenericFeaturePage 驱动）                             */
/* -------------------------------------------------------------------------- */

function statusCol(
  map: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'muted' | 'default' }>,
): TableColumn<Record<string, any>> {
  return {
    key: 'status',
    header: '状态',
    align: 'center',
    render: (row) => {
      const cfg = map[row.status] ?? { label: row.status, variant: 'muted' as const }
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>
    },
  }
}

export const genericPageConfigs: GenericPageConfig[] = [
  {
    id: 'delivery-detail',
    title: '交付明细',
    description: '查看项目交付件和交付状态',
    icon: PackageCheck,
    kpis: [
      { id: 'd1', label: '交付件总数', value: '128', sublabel: '本季度累计', icon: PackageCheck, trend: [80, 88, 94, 100, 108, 116, 122, 128], trendColor: 'primary' },
      { id: 'd2', label: '已交付', value: '96', sublabel: '占比 75%', icon: PackageCheck, trend: [50, 58, 64, 70, 78, 85, 90, 96], trendColor: 'success' },
      { id: 'd3', label: '逾期交付', value: '10', sublabel: '需跟进', icon: AlertTriangle, trend: [3, 4, 5, 6, 7, 8, 9, 10], trendColor: 'danger' },
    ],
    trendTitle: '交付趋势',
    trendData: [
      { month: '1月', planned: 14, actual: 12 },
      { month: '2月', planned: 20, actual: 17 },
      { month: '3月', planned: 26, actual: 23 },
      { month: '4月', planned: 30, actual: 27 },
      { month: '5月', planned: 34, actual: 30 },
      { month: '6月', planned: 38, actual: 32 },
    ],
    trendSeries: [
      { key: 'planned', name: '计划交付', color: 'hsl(var(--primary))' },
      { key: 'actual', name: '实际交付', color: 'hsl(var(--success))' },
    ],
    tableTitle: '交付件列表',
    tableColumns: [
      { key: 'name', header: '交付件名称' },
      { key: 'project', header: '所属项目' },
      { key: 'owner', header: '负责人' },
      { key: 'dueDate', header: '计划交付日期' },
      statusCol({
        delivered: { label: '已交付', variant: 'success' },
        pending: { label: '待交付', variant: 'warning' },
        overdue: { label: '已逾期', variant: 'danger' },
      }),
    ],
    tableRows: [
      { id: 1, name: '芯片规格说明书', project: 'XX芯片项目', owner: '张伟', dueDate: '2026-09-10', status: 'overdue' },
      { id: 2, name: '系统集成测试报告', project: 'YY平台项目', owner: '李娜', dueDate: '2026-09-18', status: 'pending' },
      { id: 3, name: '验证用例集 V3', project: 'ZZ验证项目', owner: '王强', dueDate: '2026-09-05', status: 'delivered' },
      { id: 4, name: '架构设计文档', project: '云端调度平台', owner: '赵敏', dueDate: '2026-09-22', status: 'pending' },
      { id: 5, name: '量产测试报告', project: '智能网关 V2', owner: '陈曦', dueDate: '2026-08-30', status: 'delivered' },
    ],
  },
  {
    id: 'ccb-change',
    title: 'CCB变更',
    description: '管理项目变更申请和审批流程',
    icon: GitPullRequestArrow,
    kpis: [
      { id: 'c1', label: '变更申请总数', value: '34', sublabel: '本季度累计', icon: GitPullRequestArrow, trend: [10, 14, 18, 22, 26, 30, 32, 34], trendColor: 'primary' },
      { id: 'c2', label: '待审批', value: '6', sublabel: '需及时处理', icon: Clock, trend: [2, 3, 4, 5, 4, 5, 6, 6], trendColor: 'warning' },
      { id: 'c3', label: '本月新增', value: '9', sublabel: '较上月 +2', icon: Flag, trend: [3, 4, 5, 6, 7, 7, 8, 9], trendColor: 'primary' },
    ],
    trendTitle: '变更趋势',
    trendData: [
      { month: '1月', applied: 4, approved: 3 },
      { month: '2月', applied: 6, approved: 5 },
      { month: '3月', applied: 5, approved: 5 },
      { month: '4月', applied: 7, approved: 6 },
      { month: '5月', applied: 6, approved: 5 },
      { month: '6月', applied: 9, approved: 7 },
    ],
    trendSeries: [
      { key: 'applied', name: '申请数', color: 'hsl(var(--primary))' },
      { key: 'approved', name: '批准数', color: 'hsl(var(--success))' },
    ],
    tableTitle: '变更申请列表',
    tableColumns: [
      { key: 'code', header: '变更编号' },
      { key: 'project', header: '所属项目' },
      { key: 'type', header: '变更类型' },
      { key: 'applicant', header: '申请人' },
      statusCol({
        approved: { label: '已批准', variant: 'success' },
        reviewing: { label: '审批中', variant: 'warning' },
        rejected: { label: '已驳回', variant: 'danger' },
      }),
    ],
    tableRows: [
      { id: 1, code: 'CCB-2026-021', project: 'XX芯片项目', type: '需求变更', applicant: '张伟', status: 'reviewing' },
      { id: 2, code: 'CCB-2026-020', project: 'YY平台项目', type: '进度变更', applicant: '李娜', status: 'approved' },
      { id: 3, code: 'CCB-2026-019', project: 'ZZ验证项目', type: '资源变更', applicant: '王强', status: 'approved' },
      { id: 4, code: 'CCB-2026-018', project: '数据中台重构', type: '设计变更', applicant: '刘洋', status: 'rejected' },
    ],
  },
  {
    id: 'quality-health',
    title: '质量健康',
    description: '查看项目质量、缺陷和健康度',
    icon: HeartPulse,
    kpis: [
      { id: 'q1', label: '平均质量得分', value: '87', sublabel: '满分 100', icon: HeartPulse, trend: [80, 81, 83, 84, 85, 86, 86, 87], trendColor: 'success' },
      { id: 'q2', label: '缺陷总数', value: '156', sublabel: '累计发现', icon: AlertTriangle, trend: [90, 105, 118, 128, 138, 146, 150, 156], trendColor: 'warning' },
      { id: 'q3', label: '严重缺陷', value: '12', sublabel: '需优先修复', icon: AlertTriangle, trend: [4, 5, 6, 7, 8, 9, 10, 12], trendColor: 'danger' },
    ],
    trendTitle: '缺陷趋势',
    trendData: [
      { month: '1月', opened: 20, closed: 14 },
      { month: '2月', opened: 24, closed: 18 },
      { month: '3月', opened: 22, closed: 20 },
      { month: '4月', opened: 26, closed: 22 },
      { month: '5月', opened: 18, closed: 20 },
      { month: '6月', opened: 16, closed: 19 },
    ],
    trendSeries: [
      { key: 'opened', name: '新增缺陷', color: 'hsl(var(--danger))' },
      { key: 'closed', name: '关闭缺陷', color: 'hsl(var(--success))' },
    ],
    tableTitle: '项目质量列表',
    tableColumns: [
      { key: 'project', header: '项目名称' },
      { key: 'score', header: '质量得分' },
      { key: 'defects', header: '缺陷数' },
      { key: 'critical', header: '严重缺陷' },
      statusCol({
        normal: { label: '正常', variant: 'success' },
        warning: { label: '预警', variant: 'warning' },
        risk: { label: '风险', variant: 'danger' },
      }),
    ],
    tableRows: [
      { id: 1, project: 'XX芯片项目', score: 82, defects: 34, critical: 5, status: 'risk' },
      { id: 2, project: 'YY平台项目', score: 88, defects: 22, critical: 2, status: 'warning' },
      { id: 3, project: 'ZZ验证项目', score: 91, defects: 15, critical: 1, status: 'normal' },
      { id: 4, project: '智能网关 V2', score: 95, defects: 8, critical: 0, status: 'normal' },
    ],
  },
  {
    id: 'resource-usage',
    title: '资源占用',
    description: '查看服务器、EMU、EDA、IP等研发资源',
    icon: Server,
    kpis: [
      { id: 'r1', label: '服务器占用率', value: '76%', sublabel: '较上周 +4pt', icon: Server, trend: [60, 63, 66, 68, 70, 72, 74, 76], trendColor: 'primary' },
      { id: 'r2', label: 'EDA许可占用', value: '62%', sublabel: '峰值时段', icon: FlaskConical, trend: [40, 45, 48, 52, 55, 58, 60, 62], trendColor: 'warning' },
      { id: 'r3', label: 'IP复用数', value: '45', sublabel: '本季度累计', icon: Boxes, trend: [30, 32, 35, 37, 39, 41, 43, 45], trendColor: 'success' },
    ],
    trendTitle: '资源占用趋势',
    trendData: [
      { month: '1月', server: 55, eda: 40 },
      { month: '2月', server: 60, eda: 45 },
      { month: '3月', server: 64, eda: 48 },
      { month: '4月', server: 68, eda: 52 },
      { month: '5月', server: 72, eda: 58 },
      { month: '6月', server: 76, eda: 62 },
    ],
    trendSeries: [
      { key: 'server', name: '服务器占用率', color: 'hsl(var(--primary))' },
      { key: 'eda', name: 'EDA占用率', color: 'hsl(var(--warning))' },
    ],
    tableTitle: '资源占用明细',
    tableColumns: [
      { key: 'resource', header: '资源类型' },
      { key: 'project', header: '所属项目' },
      { key: 'used', header: '占用数量' },
      { key: 'total', header: '总量' },
      { key: 'rate', header: '占用率' },
    ],
    tableRows: [
      { id: 1, resource: '计算服务器', project: 'XX芯片项目', used: 48, total: 60, rate: '80%' },
      { id: 2, resource: 'EDA许可', project: 'YY平台项目', used: 32, total: 50, rate: '64%' },
      { id: 3, resource: 'IP核', project: 'ZZ验证项目', used: 12, total: 20, rate: '60%' },
      { id: 4, resource: 'EMU设备', project: '智能网关 V2', used: 6, total: 8, rate: '75%' },
    ],
  },
  {
    id: 'svt-special',
    title: 'SVT专项',
    description: '查看SVT专项任务和执行情况',
    icon: FlaskConical,
    kpis: [
      { id: 'sv1', label: '专项任务数', value: '24', sublabel: '覆盖 6 个项目', icon: FlaskConical, trend: [14, 16, 18, 19, 20, 22, 23, 24], trendColor: 'primary' },
      { id: 'sv2', label: '已完成', value: '15', sublabel: '占比 62.5%', icon: PackageCheck, trend: [6, 8, 9, 10, 12, 13, 14, 15], trendColor: 'success' },
      { id: 'sv3', label: '执行中', value: '9', sublabel: '预计本月完成', icon: Activity, trend: [8, 8, 9, 9, 8, 9, 9, 9], trendColor: 'warning' },
    ],
    trendTitle: '执行进度趋势',
    trendData: [
      { month: '1月', done: 6 },
      { month: '2月', done: 8 },
      { month: '3月', done: 9 },
      { month: '4月', done: 11 },
      { month: '5月', done: 13 },
      { month: '6月', done: 15 },
    ],
    trendSeries: [{ key: 'done', name: '累计完成', color: 'hsl(var(--primary))' }],
    tableTitle: 'SVT专项任务列表',
    tableColumns: [
      { key: 'task', header: '任务名称' },
      { key: 'project', header: '所属项目' },
      { key: 'owner', header: '负责人' },
      { key: 'dueDate', header: '计划完成' },
      statusCol({
        done: { label: '已完成', variant: 'success' },
        running: { label: '执行中', variant: 'warning' },
        blocked: { label: '受阻', variant: 'danger' },
      }),
    ],
    tableRows: [
      { id: 1, task: 'SVT用例开发', project: 'ZZ验证项目', owner: '王强', dueDate: '2026-09-25', status: 'running' },
      { id: 2, task: 'SVT回归测试', project: 'XX芯片项目', owner: '张伟', dueDate: '2026-09-12', status: 'done' },
      { id: 3, task: 'SVT环境搭建', project: 'YY平台项目', owner: '李娜', dueDate: '2026-09-30', status: 'blocked' },
    ],
  },
  {
    id: 'budget',
    title: '预算',
    description: '查看项目预算和费用执行情况',
    icon: Wallet,
    kpis: [
      { id: 'b1', label: '预算总额(万元)', value: '3200', sublabel: '本年度', icon: Wallet, trend: [2600, 2750, 2850, 2950, 3050, 3120, 3160, 3200], trendColor: 'primary' },
      { id: 'b2', label: '已使用(万元)', value: '2150', sublabel: '执行率 67.2%', icon: Activity, trend: [1500, 1650, 1750, 1850, 1950, 2020, 2090, 2150], trendColor: 'warning' },
      { id: 'b3', label: '剩余(万元)', value: '1050', sublabel: '预计年底结余', icon: PackageCheck, trend: [1100, 1100, 1100, 1100, 1100, 1100, 1070, 1050], trendColor: 'success' },
    ],
    trendTitle: '预算执行趋势',
    trendData: [
      { month: '1月', budget: 2600, spent: 1500 },
      { month: '2月', budget: 2750, spent: 1650 },
      { month: '3月', budget: 2850, spent: 1750 },
      { month: '4月', budget: 2950, spent: 1850 },
      { month: '5月', budget: 3050, spent: 1950 },
      { month: '6月', budget: 3200, spent: 2150 },
    ],
    trendSeries: [
      { key: 'budget', name: '预算', color: 'hsl(var(--primary))' },
      { key: 'spent', name: '实际支出', color: 'hsl(var(--warning))' },
    ],
    tableTitle: '项目预算列表',
    tableColumns: [
      { key: 'project', header: '项目名称' },
      { key: 'budget', header: '预算(万元)' },
      { key: 'used', header: '已用(万元)' },
      { key: 'rate', header: '执行率' },
      statusCol({
        normal: { label: '正常', variant: 'success' },
        warning: { label: '预警', variant: 'warning' },
        over: { label: '超支', variant: 'danger' },
      }),
    ],
    tableRows: [
      { id: 1, project: 'XX芯片项目', budget: 850, used: 640, rate: '75%', status: 'warning' },
      { id: 2, project: 'YY平台项目', budget: 620, used: 410, rate: '66%', status: 'normal' },
      { id: 3, project: 'ZZ验证项目', budget: 380, used: 395, rate: '104%', status: 'over' },
      { id: 4, project: '智能网关 V2', budget: 520, used: 300, rate: '58%', status: 'normal' },
    ],
  },
  {
    id: 'incentive',
    title: '激励',
    description: '管理项目和人员激励信息',
    icon: Award,
    kpis: [
      { id: 'i1', label: '激励项目数', value: '12', sublabel: '本年度累计', icon: Award, trend: [4, 5, 6, 7, 8, 9, 10, 12], trendColor: 'primary' },
      { id: 'i2', label: '激励人次', value: '86', sublabel: '较去年 +18', icon: Users, trend: [40, 48, 55, 62, 68, 74, 80, 86], trendColor: 'success' },
      { id: 'i3', label: '本月发放(万元)', value: '45', sublabel: '预算内执行', icon: Wallet, trend: [20, 24, 28, 30, 34, 38, 41, 45], trendColor: 'primary' },
    ],
    trendTitle: '激励发放趋势',
    trendData: [
      { month: '1月', amount: 18 },
      { month: '2月', amount: 22 },
      { month: '3月', amount: 27 },
      { month: '4月', amount: 30 },
      { month: '5月', amount: 38 },
      { month: '6月', amount: 45 },
    ],
    trendSeries: [{ key: 'amount', name: '发放金额(万元)', color: 'hsl(var(--primary))' }],
    tableTitle: '激励记录列表',
    tableColumns: [
      { key: 'project', header: '项目名称' },
      { key: 'type', header: '激励类型' },
      { key: 'target', header: '激励对象' },
      { key: 'amount', header: '金额(万元)' },
      statusCol({
        paid: { label: '已发放', variant: 'success' },
        pending: { label: '审批中', variant: 'warning' },
      }),
    ],
    tableRows: [
      { id: 1, project: 'XX芯片项目', type: '里程碑激励', target: '芯片设计组', amount: 12, status: 'paid' },
      { id: 2, project: '智能网关 V2', type: '量产激励', target: '全体成员', amount: 20, status: 'paid' },
      { id: 3, project: 'YY平台项目', type: '专项奖励', target: '李娜', amount: 5, status: 'pending' },
    ],
  },
  {
    id: 'work-hours',
    title: '研发工时',
    description: '查看研发人员工时填报及异常情况',
    icon: Clock,
    kpis: [
      { id: 'w1', label: '本月总工时', value: '18600', sublabel: '单位：小时', icon: Clock, trend: [15000, 15600, 16200, 16800, 17400, 17900, 18200, 18600], trendColor: 'primary' },
      { id: 'w2', label: '平均填报率', value: '94%', sublabel: '较上月 +2pt', icon: PackageCheck, trend: [88, 89, 90, 91, 92, 93, 93, 94], trendColor: 'success' },
      { id: 'w3', label: '异常工时人数', value: '7', sublabel: '需提醒补报', icon: AlertTriangle, trend: [10, 9, 9, 8, 8, 7, 7, 7], trendColor: 'warning' },
    ],
    trendTitle: '工时填报趋势',
    trendData: [
      { month: '1月', hours: 15000 },
      { month: '2月', hours: 15600 },
      { month: '3月', hours: 16200 },
      { month: '4月', hours: 16800 },
      { month: '5月', hours: 17400 },
      { month: '6月', hours: 18600 },
    ],
    trendSeries: [{ key: 'hours', name: '总工时', color: 'hsl(var(--primary))' }],
    tableTitle: '工时异常列表',
    tableColumns: [
      { key: 'name', header: '姓名' },
      { key: 'project', header: '所属项目' },
      { key: 'hours', header: '本月工时' },
      { key: 'rate', header: '填报率' },
      statusCol({
        normal: { label: '正常', variant: 'success' },
        abnormal: { label: '异常', variant: 'danger' },
      }),
    ],
    tableRows: [
      { id: 1, name: '孙芳', project: '低功耗IP复用', hours: 142, rate: '81%', status: 'abnormal' },
      { id: 2, name: '张伟', project: 'XX芯片项目', hours: 186, rate: '98%', status: 'normal' },
      { id: 3, name: '刘洋', project: '数据中台重构', hours: 160, rate: '88%', status: 'abnormal' },
    ],
  },
  {
    id: 'project-list',
    title: '项目清单',
    description: '统一管理全部研发项目',
    icon: ListChecks,
    kpis: [
      { id: 'pl1', label: '项目总数', value: '42', sublabel: '较上季度 +5', icon: ListChecks, trend: [30, 32, 34, 36, 38, 40, 41, 42], trendColor: 'primary' },
      { id: 'pl2', label: '在研项目', value: '26', sublabel: '占比 61.9%', icon: Activity, trend: [18, 19, 20, 22, 23, 24, 25, 26], trendColor: 'success' },
      { id: 'pl3', label: '已归档', value: '16', sublabel: '本年度累计', icon: PackageCheck, trend: [10, 11, 12, 13, 14, 15, 15, 16], trendColor: 'primary' },
    ],
    trendTitle: '项目数量趋势',
    trendData: [
      { month: '1月', created: 3, archived: 1 },
      { month: '2月', created: 4, archived: 2 },
      { month: '3月', created: 2, archived: 1 },
      { month: '4月', created: 5, archived: 3 },
      { month: '5月', created: 3, archived: 2 },
      { month: '6月', created: 4, archived: 2 },
    ],
    trendSeries: [
      { key: 'created', name: '新增项目', color: 'hsl(var(--primary))' },
      { key: 'archived', name: '归档项目', color: 'hsl(var(--muted-foreground))' },
    ],
    tableTitle: '项目清单',
    tableColumns: [
      { key: 'name', header: '项目名称' },
      { key: 'type', header: '项目类型' },
      { key: 'owner', header: '负责人' },
      { key: 'startDate', header: '立项时间' },
      statusCol({
        active: { label: '在研', variant: 'success' },
        archived: { label: '已归档', variant: 'muted' },
      }),
    ],
    tableRows: [
      { id: 1, name: 'XX芯片项目', type: '芯片研发', owner: '张伟', startDate: '2025-03-01', status: 'active' },
      { id: 2, name: 'YY平台项目', type: '平台研发', owner: '李娜', startDate: '2025-05-12', status: 'active' },
      { id: 3, name: '旧版网关 V1', type: '硬件研发', owner: '陈曦', startDate: '2023-01-10', status: 'archived' },
    ],
  },
  {
    id: 'project-compliance',
    title: '项目合规',
    description: '检查交付件、时间和质量合规性',
    icon: ShieldCheck,
    kpis: [
      { id: 'pc1', label: '合规检查项目数', value: '42', sublabel: '全量覆盖', icon: ShieldCheck, trend: [42, 42, 42, 42, 42, 42, 42, 42], trendColor: 'primary' },
      { id: 'pc2', label: '合规达标', value: '35', sublabel: '占比 83.3%', icon: PackageCheck, trend: [28, 29, 30, 31, 32, 33, 34, 35], trendColor: 'success' },
      { id: 'pc3', label: '待整改', value: '7', sublabel: '需限期完成', icon: AlertTriangle, trend: [10, 9, 9, 8, 8, 7, 7, 7], trendColor: 'danger' },
    ],
    trendTitle: '合规趋势',
    trendData: [
      { month: '1月', compliant: 28 },
      { month: '2月', compliant: 29 },
      { month: '3月', compliant: 30 },
      { month: '4月', compliant: 32 },
      { month: '5月', compliant: 34 },
      { month: '6月', compliant: 35 },
    ],
    trendSeries: [{ key: 'compliant', name: '合规项目数', color: 'hsl(var(--success))' }],
    tableTitle: '项目合规列表',
    tableColumns: [
      { key: 'project', header: '项目名称' },
      { key: 'deliverable', header: '交付件合规' },
      { key: 'schedule', header: '时间合规' },
      { key: 'quality', header: '质量合规' },
      statusCol({
        pass: { label: '合规', variant: 'success' },
        fail: { label: '待整改', variant: 'danger' },
      }),
    ],
    tableRows: [
      { id: 1, project: 'XX芯片项目', deliverable: '是', schedule: '否', quality: '是', status: 'fail' },
      { id: 2, project: 'YY平台项目', deliverable: '是', schedule: '是', quality: '是', status: 'pass' },
      { id: 3, project: '智能网关 V2', deliverable: '是', schedule: '是', quality: '是', status: 'pass' },
    ],
  },
  {
    id: 'material-tracking',
    title: '物料去向',
    description: '跟踪研发物料采购、领用和流转',
    icon: Boxes,
    kpis: [
      { id: 'm1', label: '物料采购总数', value: '320', sublabel: '本年度累计', icon: Boxes, trend: [240, 260, 275, 290, 300, 308, 315, 320], trendColor: 'primary' },
      { id: 'm2', label: '领用中', value: '210', sublabel: '占比 65.6%', icon: Activity, trend: [150, 165, 175, 185, 195, 200, 205, 210], trendColor: 'warning' },
      { id: 'm3', label: '待归还', value: '18', sublabel: '需跟进催还', icon: AlertTriangle, trend: [8, 10, 12, 13, 14, 15, 16, 18], trendColor: 'danger' },
    ],
    trendTitle: '物料流转趋势',
    trendData: [
      { month: '1月', in: 40, out: 32 },
      { month: '2月', in: 45, out: 36 },
      { month: '3月', in: 50, out: 42 },
      { month: '4月', in: 48, out: 40 },
      { month: '5月', in: 52, out: 45 },
      { month: '6月', in: 55, out: 47 },
    ],
    trendSeries: [
      { key: 'in', name: '入库数', color: 'hsl(var(--primary))' },
      { key: 'out', name: '领用数', color: 'hsl(var(--warning))' },
    ],
    tableTitle: '物料流转列表',
    tableColumns: [
      { key: 'material', header: '物料名称' },
      { key: 'project', header: '所属项目' },
      { key: 'holder', header: '领用人' },
      { key: 'date', header: '领用日期' },
      statusCol({
        inuse: { label: '使用中', variant: 'warning' },
        returned: { label: '已归还', variant: 'success' },
        overdue: { label: '逾期未还', variant: 'danger' },
      }),
    ],
    tableRows: [
      { id: 1, material: '开发板 EVB-A1', project: 'XX芯片项目', holder: '张伟', date: '2026-08-01', status: 'inuse' },
      { id: 2, material: '示波器', project: 'ZZ验证项目', holder: '王强', date: '2026-07-15', status: 'overdue' },
      { id: 3, material: '测试探针卡', project: 'YY平台项目', holder: '李娜', date: '2026-09-01', status: 'returned' },
    ],
  },
  {
    id: 'gov-projects',
    title: '政府项目',
    description: '管理政府项目申报、执行和验收',
    icon: Landmark,
    kpis: [
      { id: 'g1', label: '政府项目数', value: '9', sublabel: '本年度在研', icon: Landmark, trend: [6, 6, 7, 7, 8, 8, 9, 9], trendColor: 'primary' },
      { id: 'g2', label: '申报中', value: '3', sublabel: '待审批', icon: Clock, trend: [2, 2, 3, 2, 3, 3, 3, 3], trendColor: 'warning' },
      { id: 'g3', label: '验收中', value: '2', sublabel: '本季度到期', icon: ShieldCheck, trend: [1, 1, 1, 2, 2, 2, 2, 2], trendColor: 'primary' },
    ],
    trendTitle: '申报与验收趋势',
    trendData: [
      { month: '1月', applied: 1, accepted: 0 },
      { month: '2月', applied: 1, accepted: 1 },
      { month: '3月', applied: 0, accepted: 1 },
      { month: '4月', applied: 1, accepted: 0 },
      { month: '5月', applied: 2, accepted: 1 },
      { month: '6月', applied: 1, accepted: 1 },
    ],
    trendSeries: [
      { key: 'applied', name: '新增申报', color: 'hsl(var(--primary))' },
      { key: 'accepted', name: '完成验收', color: 'hsl(var(--success))' },
    ],
    tableTitle: '政府项目列表',
    tableColumns: [
      { key: 'name', header: '项目名称' },
      { key: 'funder', header: '资助单位' },
      { key: 'owner', header: '负责人' },
      { key: 'stage', header: '当前阶段' },
      statusCol({
        applying: { label: '申报中', variant: 'warning' },
        running: { label: '执行中', variant: 'default' },
        accepting: { label: '验收中', variant: 'success' },
      }),
    ],
    tableRows: [
      { id: 1, name: '核心芯片专项', funder: '省科技厅', owner: '张伟', stage: '中期执行', status: 'running' },
      { id: 2, name: '智能制造示范', funder: '市工信局', owner: '赵敏', stage: '验收准备', status: 'accepting' },
      { id: 3, name: '关键技术攻关', funder: '国家基金委', owner: '李娜', stage: '材料申报', status: 'applying' },
    ],
  },
  {
    id: 'achievements',
    title: '成果转化与保护',
    description: '管理专利、软著和研发成果',
    icon: Lightbulb,
    kpis: [
      { id: 'a1', label: '专利申请数', value: '56', sublabel: '累计申请', icon: Lightbulb, trend: [40, 43, 46, 48, 50, 52, 54, 56], trendColor: 'primary' },
      { id: 'a2', label: '软著登记数', value: '34', sublabel: '累计登记', icon: PackageCheck, trend: [22, 24, 26, 28, 29, 31, 32, 34], trendColor: 'success' },
      { id: 'a3', label: '本年新增', value: '12', sublabel: '较去年 +3', icon: Flag, trend: [4, 5, 6, 7, 8, 9, 10, 12], trendColor: 'primary' },
    ],
    trendTitle: '成果趋势',
    trendData: [
      { month: '1月', patent: 2, software: 1 },
      { month: '2月', patent: 3, software: 1 },
      { month: '3月', patent: 2, software: 2 },
      { month: '4月', patent: 3, software: 1 },
      { month: '5月', patent: 4, software: 2 },
      { month: '6月', patent: 3, software: 2 },
    ],
    trendSeries: [
      { key: 'patent', name: '专利', color: 'hsl(var(--primary))' },
      { key: 'software', name: '软著', color: 'hsl(var(--success))' },
    ],
    tableTitle: '成果列表',
    tableColumns: [
      { key: 'name', header: '成果名称' },
      { key: 'type', header: '类型' },
      { key: 'project', header: '所属项目' },
      { key: 'applicant', header: '申请人' },
      statusCol({
        granted: { label: '已授权', variant: 'success' },
        reviewing: { label: '审查中', variant: 'warning' },
      }),
    ],
    tableRows: [
      { id: 1, name: '一种低功耗芯片架构', type: '发明专利', project: 'XX芯片项目', applicant: '张伟', status: 'reviewing' },
      { id: 2, name: '项目管理调度系统 V2', type: '软件著作权', project: '云端调度平台', applicant: '赵敏', status: 'granted' },
      { id: 3, name: '一种资源复用方法', type: '实用新型', project: '低功耗IP复用', applicant: '孙芳', status: 'granted' },
    ],
  },
  {
    id: 'field-mapping',
    title: '字段映射',
    description: '配置不同系统之间的数据字段映射',
    icon: ArrowLeftRight,
    kpis: [
      { id: 'fm1', label: '映射规则数', value: '48', sublabel: '覆盖 6 个系统', icon: ArrowLeftRight, trend: [30, 34, 38, 40, 42, 44, 46, 48], trendColor: 'primary' },
      { id: 'fm2', label: '已启用', value: '40', sublabel: '占比 83.3%', icon: PackageCheck, trend: [24, 28, 30, 32, 34, 36, 38, 40], trendColor: 'success' },
      { id: 'fm3', label: '待确认', value: '8', sublabel: '需人工核对', icon: AlertTriangle, trend: [10, 9, 9, 8, 8, 8, 8, 8], trendColor: 'warning' },
    ],
    trendTitle: '映射变更趋势',
    trendData: [
      { month: '1月', rules: 30 },
      { month: '2月', rules: 34 },
      { month: '3月', rules: 38 },
      { month: '4月', rules: 40 },
      { month: '5月', rules: 44 },
      { month: '6月', rules: 48 },
    ],
    trendSeries: [{ key: 'rules', name: '规则数', color: 'hsl(var(--primary))' }],
    tableTitle: '字段映射列表',
    tableColumns: [
      { key: 'sourceField', header: '源系统字段' },
      { key: 'targetField', header: '目标系统字段' },
      { key: 'system', header: '所属系统' },
      { key: 'type', header: '映射类型' },
      statusCol({
        enabled: { label: '已启用', variant: 'success' },
        pending: { label: '待确认', variant: 'warning' },
      }),
    ],
    tableRows: [
      { id: 1, sourceField: 'jira.issue_id', targetField: 'pmo.task_id', system: 'Jira ↔ PMO', type: '一对一', status: 'enabled' },
      { id: 2, sourceField: 'confluence.page_id', targetField: 'pmo.doc_id', system: 'Confluence ↔ PMO', type: '一对一', status: 'pending' },
      { id: 3, sourceField: 'erp.budget_code', targetField: 'pmo.budget_id', system: 'ERP ↔ PMO', type: '一对多', status: 'enabled' },
    ],
  },
  {
    id: 'staff-classification',
    title: '人员分类',
    description: '按照岗位和角色配置人员分类及权限',
    icon: UserCog,
    kpis: [
      { id: 'sc1', label: '人员总数', value: '186', sublabel: '在职研发人员', icon: Users, trend: [160, 165, 170, 174, 178, 181, 184, 186], trendColor: 'primary' },
      { id: 'sc2', label: '已分类', value: '172', sublabel: '占比 92.5%', icon: UserCog, trend: [140, 148, 154, 160, 164, 168, 170, 172], trendColor: 'success' },
      { id: 'sc3', label: '待分类', value: '14', sublabel: '新入职人员', icon: AlertTriangle, trend: [20, 18, 16, 15, 14, 14, 14, 14], trendColor: 'warning' },
    ],
    trendTitle: '分类变更趋势',
    trendData: [
      { month: '1月', classified: 140 },
      { month: '2月', classified: 148 },
      { month: '3月', classified: 154 },
      { month: '4月', classified: 160 },
      { month: '5月', classified: 168 },
      { month: '6月', classified: 172 },
    ],
    trendSeries: [{ key: 'classified', name: '已分类人数', color: 'hsl(var(--primary))' }],
    tableTitle: '人员分类列表',
    tableColumns: [
      { key: 'name', header: '姓名' },
      { key: 'role', header: '岗位' },
      { key: 'category', header: '角色分类' },
      { key: 'level', header: '权限级别' },
      statusCol({
        classified: { label: '已分类', variant: 'success' },
        pending: { label: '待分类', variant: 'warning' },
      }),
    ],
    tableRows: [
      { id: 1, name: '张伟', role: '芯片设计工程师', category: '核心研发', level: 'P6', status: 'classified' },
      { id: 2, name: '周涛', role: '测试工程师', category: '待定', level: '-', status: 'pending' },
      { id: 3, name: '李娜', role: '系统架构师', category: '技术专家', level: 'P8', status: 'classified' },
    ],
  },
  {
    id: 'notification-config',
    title: '通知配置',
    description: '配置企业微信、邮件、系统消息等通知规则',
    icon: BellRing,
    kpis: [
      { id: 'n1', label: '通知规则数', value: '22', sublabel: '覆盖全部业务模块', icon: BellRing, trend: [14, 16, 17, 18, 19, 20, 21, 22], trendColor: 'primary' },
      { id: 'n2', label: '已启用', value: '18', sublabel: '占比 81.8%', icon: PackageCheck, trend: [10, 12, 13, 14, 15, 16, 17, 18], trendColor: 'success' },
      { id: 'n3', label: '本月触发次数', value: '340', sublabel: '较上月 +56', icon: Activity, trend: [200, 220, 240, 260, 285, 300, 320, 340], trendColor: 'primary' },
    ],
    trendTitle: '通知触发趋势',
    trendData: [
      { month: '1月', triggered: 200 },
      { month: '2月', triggered: 220 },
      { month: '3月', triggered: 240 },
      { month: '4月', triggered: 260 },
      { month: '5月', triggered: 300 },
      { month: '6月', triggered: 340 },
    ],
    trendSeries: [{ key: 'triggered', name: '触发次数', color: 'hsl(var(--primary))' }],
    tableTitle: '通知规则列表',
    tableColumns: [
      { key: 'rule', header: '规则名称' },
      { key: 'channel', header: '通知渠道' },
      { key: 'condition', header: '触发条件' },
      { key: 'receiver', header: '接收对象' },
      statusCol({
        enabled: { label: '已启用', variant: 'success' },
        disabled: { label: '已停用', variant: 'muted' },
      }),
    ],
    tableRows: [
      { id: 1, rule: '项目延期预警', channel: '企业微信', condition: '实际进度落后 > 10%', receiver: '项目负责人', status: 'enabled' },
      { id: 2, rule: '预算超支提醒', channel: '邮件', condition: '执行率 > 100%', receiver: 'PMO', status: 'enabled' },
      { id: 3, rule: '工时未填报提醒', channel: '系统消息', condition: '连续 3 天未填报', receiver: '本人', status: 'disabled' },
    ],
  },
]
