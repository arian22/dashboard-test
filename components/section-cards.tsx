import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div dir="rtl" className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card text-right" dir="rtl">
        <CardHeader>
          <CardDescription>بالانس گرمی</CardDescription>
          <CardTitle dir="ltr" className="text-2xl text-primary font-semibold tabular-nums @[250px]/card:text-2xl">
            7,276 gr
          </CardTitle>
          <CardAction>
            <Badge variant="outline" dir="ltr">
              9.5%
              <IconTrendingUp />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-col items-end gap-1.5 text-sm text-right">
          <div className="line-clamp-1 flex items-center justify-end gap-2 font-medium">
            <IconTrendingUp className="size-4" />
            حجم معاملات بیش از 2 کیلو نسبت به ماه گذشته
          </div>
          <div className="text-muted-foreground">
            روند رشد پایدار
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card text-right" dir="rtl">
        <CardHeader>
          <CardDescription>بالانس ارزی</CardDescription>
          <CardTitle dir="ltr" className="text-2xl text-primary font-semibold tabular-nums @[250px]/card:text-2xl">
            51,234 $
          </CardTitle>
          <CardAction>
            <Badge variant="outline" dir="ltr">
              -20%
              <IconTrendingDown />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-col items-end gap-1.5 text-sm text-right">
          <div className="line-clamp-1 flex items-center justify-end gap-2 font-medium">
            <IconTrendingDown className="size-4" />
            کاهش 20 درصدی نسبت به ماه گذشته 
          </div>
          <div className="text-muted-foreground">
            نیاز به بررسی و بهبود جریان ارزی
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card text-right" dir="rtl">
        <CardHeader>
          <CardDescription>بالانس ریالی</CardDescription>
          <CardTitle className="text-2xl text-primary font-semibold tabular-nums @[250px]/card:text-2xl">
            67.53 
            <span className="text-muted-foreground text-xl"> میلیارد تومان</span>
          </CardTitle>
          <CardAction>
            <Badge variant="outline" dir="ltr">
              12.5%
              <IconTrendingUp />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-col items-end gap-1.5 text-sm text-right">
          <div className="line-clamp-1 flex items-center justify-end gap-2 font-medium">
            <IconTrendingUp className="size-4" />
            افزایش 12 درصدی نسبت به ماه گذشته
          </div>
          <div className="text-muted-foreground">حفظ روند افزایشی درآمد ریالی</div>
        </CardFooter>
      </Card>
      <Card className="@container/card text-right" dir="rtl">
        <CardHeader>
          <CardDescription>مجموع کل دارایی ها به دلار</CardDescription>
          <CardTitle dir="ltr" className="text-2xl text-primary font-semibold tabular-nums @[250px]/card:text-2xl">
            12,902,341 $
          </CardTitle>
          <CardAction>
            <Badge variant="outline" dir="ltr">
              4.5%
              <IconTrendingUp />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex flex-col items-end gap-1.5 text-sm text-right">
          <div className="line-clamp-1 flex items-center justify-end gap-2 font-medium">
            <IconTrendingUp className="size-4" />
            افزایش تدریجی مجموع دارایی‌ها
          </div>
          <div className="text-muted-foreground">حفظ روند صعودی سرمایه</div>
        </CardFooter>
      </Card>
    </div>
  )
}
