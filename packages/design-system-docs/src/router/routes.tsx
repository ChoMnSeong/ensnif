import type { ComponentType } from 'react'
import { IntroductionPage } from '../pages/IntroductionPage'
import { PalettesPage } from '../pages/PalettesPage'
import { SurfacesPage } from '../pages/SurfacesPage'
import { TypographyPage } from '../pages/TypographyPage'
import { TokensPage } from '../pages/TokensPage'
import { ButtonPage } from '../pages/components/ButtonPage'
import { InputPage } from '../pages/components/InputPage'
import { TextareaPage } from '../pages/components/TextareaPage'
import { LabelPage } from '../pages/components/LabelPage'
import { CardPage } from '../pages/components/CardPage'
import { BoxPage } from '../pages/components/BoxPage'
import { BadgePage } from '../pages/components/BadgePage'
import { TagPage } from '../pages/components/TagPage'
import { AlertPage } from '../pages/components/AlertPage'
import { CheckboxPage } from '../pages/components/CheckboxPage'
import { RadioPage } from '../pages/components/RadioPage'
import { SwitchPage } from '../pages/components/SwitchPage'
import { TogglePage } from '../pages/components/TogglePage'
import { TabsPage } from '../pages/components/TabsPage'
import { TablePage } from '../pages/components/TablePage'
import { DialogPage } from '../pages/components/DialogPage'
import { DrawerPage } from '../pages/components/DrawerPage'
import { DatePickerPage } from '../pages/components/DatePickerPage'
import { ComboBoxPage } from '../pages/components/ComboBoxPage'
import { SliderPage } from '../pages/components/SliderPage'
import { NumberInputPage } from '../pages/components/NumberInputPage'
import { LineChartPage } from '../pages/components/LineChartPage'
import { BarChartPage } from '../pages/components/BarChartPage'
import { AvatarPage } from '../pages/components/AvatarPage'
import { ProgressPage } from '../pages/components/ProgressPage'
import { TooltipPage } from '../pages/components/TooltipPage'
import { ToastPage } from '../pages/components/ToastPage'
import { BreadcrumbPage } from '../pages/components/BreadcrumbPage'
import { PaginationPage } from '../pages/components/PaginationPage'
import { AccordionPage } from '../pages/components/AccordionPage'
import { MenuPage } from '../pages/components/MenuPage'
import {
    DividerPage,
    StackPage,
    SpinnerPage,
    SkeletonPage,
    EmptyPage,
    StatPage,
    KbdPage,
} from '../pages/components/MiscPage'
import { ColorPickerPage } from '../pages/components/ColorPickerPage'
import { FileUploadPage } from '../pages/components/FileUploadPage'
import { TimePickerPage } from '../pages/components/TimePickerPage'
import { RatingPage } from '../pages/components/RatingPage'
import { StepperPage } from '../pages/components/StepperPage'
import { OTPInputPage } from '../pages/components/OTPInputPage'
import { CodeBlockPage } from '../pages/components/CodeBlockPage'
import { HoverCardPage } from '../pages/components/HoverCardPage'
import {
    ImagePage,
    ToolbarPage,
    ScrollAreaPage,
    FormFieldPage,
    PiePage,
    GaugePage,
    CalendarPage,
    TreePage,
    CommandPalettePage,
    NavigationMenuPage,
} from '../pages/components/MorePages'
import { MarqueePage } from '../pages/components/MarqueePage'
import {
    AreaChartPage,
    RadarChartPage,
    RadialChartPage,
} from '../pages/components/ChartsExtraPage'
import { DataTablePage } from '../pages/components/DataTablePage'

export type RouteId =
    | 'introduction'
    | 'palettes'
    | 'surfaces'
    | 'typography'
    | 'tokens'
    | 'c-button'
    | 'c-input'
    | 'c-textarea'
    | 'c-label'
    | 'c-checkbox'
    | 'c-radio'
    | 'c-switch'
    | 'c-toggle'
    | 'c-slider'
    | 'c-numberinput'
    | 'c-datepicker'
    | 'c-combobox'
    | 'c-card'
    | 'c-box'
    | 'c-divider'
    | 'c-stack'
    | 'c-tabs'
    | 'c-table'
    | 'c-accordion'
    | 'c-badge'
    | 'c-tag'
    | 'c-alert'
    | 'c-avatar'
    | 'c-stat'
    | 'c-empty'
    | 'c-kbd'
    | 'c-spinner'
    | 'c-skeleton'
    | 'c-progress'
    | 'c-tooltip'
    | 'c-toast'
    | 'c-dialog'
    | 'c-drawer'
    | 'c-menu'
    | 'c-breadcrumb'
    | 'c-pagination'
    | 'c-linechart'
    | 'c-barchart'
    | 'c-colorpicker'
    | 'c-fileupload'
    | 'c-timepicker'
    | 'c-rating'
    | 'c-otpinput'
    | 'c-stepper'
    | 'c-codeblock'
    | 'c-hovercard'
    | 'c-image'
    | 'c-toolbar'
    | 'c-scrollarea'
    | 'c-marquee'
    | 'c-formfield'
    | 'c-pie'
    | 'c-gauge'
    | 'c-calendar'
    | 'c-tree'
    | 'c-commandpalette'
    | 'c-navigationmenu'
    | 'c-areachart'
    | 'c-radarchart'
    | 'c-radialchart'
    | 'c-datatable'

export type RouteGroup =
    | 'foundation'
    | 'form'
    | 'layout'
    | 'container'
    | 'display'
    | 'feedback'
    | 'overlay'
    | 'navigation'
    | 'data'

export type RouteMeta = {
    id: RouteId
    label: string
    page: ComponentType
    description?: string
    group: RouteGroup
}

export const routes: RouteMeta[] = [
    { id: 'introduction', label: 'Introduction', group: 'foundation', page: IntroductionPage },
    { id: 'palettes', label: 'Palettes', group: 'foundation', page: PalettesPage },
    { id: 'surfaces', label: 'Surfaces', group: 'foundation', page: SurfacesPage },
    { id: 'typography', label: 'Typography', group: 'foundation', page: TypographyPage },
    { id: 'tokens', label: 'Tokens', group: 'foundation', page: TokensPage },

    { id: 'c-button', label: 'Button', group: 'form', page: ButtonPage },
    { id: 'c-input', label: 'Input', group: 'form', page: InputPage },
    { id: 'c-textarea', label: 'Textarea', group: 'form', page: TextareaPage },
    { id: 'c-label', label: 'Label', group: 'form', page: LabelPage },
    { id: 'c-checkbox', label: 'Checkbox', group: 'form', page: CheckboxPage },
    { id: 'c-radio', label: 'Radio', group: 'form', page: RadioPage },
    { id: 'c-switch', label: 'Switch', group: 'form', page: SwitchPage },
    { id: 'c-toggle', label: 'Toggle', group: 'form', page: TogglePage },
    { id: 'c-slider', label: 'Slider', group: 'form', page: SliderPage },
    { id: 'c-numberinput', label: 'NumberInput', group: 'form', page: NumberInputPage },
    { id: 'c-datepicker', label: 'DatePicker', group: 'form', page: DatePickerPage },
    { id: 'c-combobox', label: 'ComboBox', group: 'form', page: ComboBoxPage },
    { id: 'c-colorpicker', label: 'ColorPicker', group: 'form', page: ColorPickerPage },
    { id: 'c-timepicker', label: 'TimePicker', group: 'form', page: TimePickerPage },
    { id: 'c-fileupload', label: 'FileUpload', group: 'form', page: FileUploadPage },
    { id: 'c-rating', label: 'Rating', group: 'form', page: RatingPage },
    { id: 'c-otpinput', label: 'OTPInput', group: 'form', page: OTPInputPage },
    { id: 'c-formfield', label: 'FormField', group: 'form', page: FormFieldPage },

    { id: 'c-stack', label: 'Stack', group: 'layout', page: StackPage },
    { id: 'c-divider', label: 'Divider', group: 'layout', page: DividerPage },
    { id: 'c-toolbar', label: 'Toolbar', group: 'layout', page: ToolbarPage },
    { id: 'c-scrollarea', label: 'ScrollArea', group: 'layout', page: ScrollAreaPage },

    { id: 'c-card', label: 'Card', group: 'container', page: CardPage },
    { id: 'c-box', label: 'Box', group: 'container', page: BoxPage },
    { id: 'c-tabs', label: 'Tabs', group: 'container', page: TabsPage },
    { id: 'c-accordion', label: 'Accordion', group: 'container', page: AccordionPage },
    { id: 'c-table', label: 'Table', group: 'container', page: TablePage },

    { id: 'c-badge', label: 'Badge', group: 'display', page: BadgePage },
    { id: 'c-tag', label: 'Tag', group: 'display', page: TagPage },
    { id: 'c-alert', label: 'Alert', group: 'display', page: AlertPage },
    { id: 'c-avatar', label: 'Avatar', group: 'display', page: AvatarPage },
    { id: 'c-stat', label: 'Stat', group: 'display', page: StatPage },
    { id: 'c-empty', label: 'Empty', group: 'display', page: EmptyPage },
    { id: 'c-kbd', label: 'Kbd', group: 'display', page: KbdPage },
    { id: 'c-codeblock', label: 'CodeBlock', group: 'display', page: CodeBlockPage },
    { id: 'c-image', label: 'Image', group: 'display', page: ImagePage },
    { id: 'c-marquee', label: 'Marquee', group: 'display', page: MarqueePage },

    { id: 'c-spinner', label: 'Spinner', group: 'feedback', page: SpinnerPage },
    { id: 'c-skeleton', label: 'Skeleton', group: 'feedback', page: SkeletonPage },
    { id: 'c-progress', label: 'Progress', group: 'feedback', page: ProgressPage },
    { id: 'c-tooltip', label: 'Tooltip', group: 'feedback', page: TooltipPage },
    { id: 'c-toast', label: 'Toast', group: 'feedback', page: ToastPage },
    { id: 'c-hovercard', label: 'HoverCard', group: 'feedback', page: HoverCardPage },

    { id: 'c-dialog', label: 'Dialog', group: 'overlay', page: DialogPage },
    { id: 'c-drawer', label: 'Drawer', group: 'overlay', page: DrawerPage },
    { id: 'c-menu', label: 'Menu', group: 'overlay', page: MenuPage },
    { id: 'c-commandpalette', label: 'CommandPalette', group: 'overlay', page: CommandPalettePage },

    { id: 'c-breadcrumb', label: 'Breadcrumb', group: 'navigation', page: BreadcrumbPage },
    { id: 'c-pagination', label: 'Pagination', group: 'navigation', page: PaginationPage },
    { id: 'c-stepper', label: 'Stepper', group: 'navigation', page: StepperPage },
    { id: 'c-tree', label: 'Tree', group: 'navigation', page: TreePage },
    { id: 'c-navigationmenu', label: 'NavigationMenu', group: 'navigation', page: NavigationMenuPage },

    { id: 'c-linechart', label: 'LineChart', group: 'data', page: LineChartPage },
    { id: 'c-barchart', label: 'BarChart', group: 'data', page: BarChartPage },
    { id: 'c-pie', label: 'Pie/Donut', group: 'data', page: PiePage },
    { id: 'c-gauge', label: 'Gauge', group: 'data', page: GaugePage },
    { id: 'c-calendar', label: 'Calendar', group: 'data', page: CalendarPage },
    { id: 'c-areachart', label: 'AreaChart', group: 'data', page: AreaChartPage },
    { id: 'c-radarchart', label: 'RadarChart', group: 'data', page: RadarChartPage },
    { id: 'c-radialchart', label: 'RadialChart', group: 'data', page: RadialChartPage },
    { id: 'c-datatable', label: 'DataTable', group: 'data', page: DataTablePage },
]

export const routeMap: Record<RouteId, RouteMeta> = routes.reduce(
    (acc, r) => ({ ...acc, [r.id]: r }),
    {} as Record<RouteId, RouteMeta>,
)

export const isRouteId = (value: string): value is RouteId =>
    value in routeMap

export const groupOrder: RouteGroup[] = [
    'foundation',
    'form',
    'layout',
    'container',
    'display',
    'feedback',
    'overlay',
    'navigation',
    'data',
]

export const groupLabels: Record<RouteGroup, string> = {
    foundation: 'Foundation',
    form: 'Form',
    layout: 'Layout',
    container: 'Container',
    display: 'Display',
    feedback: 'Feedback',
    overlay: 'Overlay',
    navigation: 'Navigation',
    data: 'Data',
}
