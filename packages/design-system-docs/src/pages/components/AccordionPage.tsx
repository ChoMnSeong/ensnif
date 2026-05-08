import { Accordion, AccordionItem } from '@ensnif/design-system'
import { PageHeader } from '../../components/PageHeader'
import { ComponentPreview } from '../../components/ComponentPreview'

export const AccordionPage = () => (
    <>
        <PageHeader
            eyebrow="Component"
            title="Accordion"
            description="single/multiple 선택. type='single'은 한 번에 하나만, 'multiple'은 여러 개 동시."
        />

        <ComponentPreview
            title="Single (기본)"
            code={`<Accordion type="single" defaultValue="a">
    <AccordionItem value="a" title="제목">
        본문
    </AccordionItem>
</Accordion>`}
        >
            <Accordion
                type="single"
                defaultValue="a"
                style={{ width: '100%', maxWidth: '480px' }}
            >
                <AccordionItem value="a" title="구독은 어떻게 하나요?">
                    설정 페이지에서 결제 정보를 입력한 뒤 Premium 멤버십을
                    선택하시면 됩니다.
                </AccordionItem>
                <AccordionItem value="b" title="해지는 어떻게 하나요?">
                    설정 → 구독 → 해지 버튼으로 즉시 해지할 수 있습니다.
                </AccordionItem>
                <AccordionItem value="c" title="환불 정책은 어떻게 되나요?">
                    결제 후 7일 이내에 한해 환불이 가능합니다.
                </AccordionItem>
            </Accordion>
        </ComponentPreview>

        <ComponentPreview
            title="Multiple"
            code={`<Accordion type="multiple">
    <AccordionItem value="a" title="섹션 1">내용</AccordionItem>
    <AccordionItem value="b" title="섹션 2">내용</AccordionItem>
</Accordion>`}
        >
            <Accordion
                type="multiple"
                style={{ width: '100%', maxWidth: '480px' }}
            >
                <AccordionItem value="a" title="섹션 1">
                    여러 개를 동시에 펼칠 수 있습니다.
                </AccordionItem>
                <AccordionItem value="b" title="섹션 2">
                    펼친 상태로 다른 섹션도 펼치면 둘 다 열려 있습니다.
                </AccordionItem>
                <AccordionItem value="c" title="섹션 3">
                    원하는 만큼 펼칠 수 있습니다.
                </AccordionItem>
            </Accordion>
        </ComponentPreview>
    </>
)
