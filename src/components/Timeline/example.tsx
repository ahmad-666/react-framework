import Timeline from '.';
import Icon from '@/components/Icon';

type Item = {
    title: string;
    description: string;
    href: string;
};

const items: Item[] = Array.from({ length: 5 }).map((_, i) => ({
    title: `Item ${i + 1}`,
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem consequatur minima delectus maxime dolores quisquam ratione corrupti error reiciendis, beatae amet similique provident inventore reprehenderit doloribus exercitationem id`,
    href: `/`
}));

export default function TimelineExample() {
    return (
        <div>
            <div>
                <p>#1: Timeline with advances props that used reverse,opposite,custom dot,...:</p>
                <Timeline
                    startOverflow
                    endOverflow
                    size={30}
                    icon='mdi:check'
                    color='green-600'
                    iconColor='white'
                    lineColor='slate-300'
                    lineSize={50}
                    renderOpposite
                    dotClassName='shadow-[0_0_0_5px_rgba(0,0,0,0.1)]'
                    lineClassName=''
                    className='mt-10'
                >
                    <Timeline.Item>
                        <Timeline.Item.Content>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem consequatur minima delectus
                            maxime dolores quisquam ratione corrupti error reiciendis, beatae amet similique provident
                            inventore reprehenderit doloribus exercitationem id Lorem ipsum dolor sit amet consectetur
                            adipisicing elit. Rem consequatur minima delectus maxime dolores quisquam ratione corrupti
                            error reiciendis, beatae amet similique provident inventore reprehenderit doloribus
                            exercitationem id Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem consequatur
                            minima delectus maxime dolores quisquam ratione corrupti error reiciendis, beatae amet
                            similique provident inventore reprehenderit doloribus exercitationem id Lorem ipsum dolor
                            sit amet consectetur adipisicing elit. Rem consequatur minima delectus maxime dolores
                            quisquam ratione corrupti error reiciendis, beatae amet similique provident inventore
                            reprehenderit doloribus exercitationem id Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Rem consequatur minima delectus maxime dolores quisquam ratione corrupti error
                            reiciendis, beatae amet similique provident inventore reprehenderit doloribus exercitationem
                            id
                        </Timeline.Item.Content>
                    </Timeline.Item>
                    <Timeline.Item reverse icon='mdi:user' color='orange-600' iconColor='orange-200'>
                        <Timeline.Item.Opposite>Opposite</Timeline.Item.Opposite>
                        <Timeline.Item.Dot className='rounded-md bg-white'>
                            <Icon icon='mdi:check' color='green-500' size='lg' />
                        </Timeline.Item.Dot>
                        <Timeline.Item.Content>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem consequatur minima delectus
                            maxime dolores quisquam ratione corrupti error reiciendis, beatae amet similique provident
                            inventore reprehenderit doloribus exercitationem id
                        </Timeline.Item.Content>
                    </Timeline.Item>
                    <Timeline.Item>
                        <Timeline.Item.Content>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem consequatur minima delectus
                            maxime dolores quisquam ratione corrupti error reiciendis, beatae amet similique provident
                            inventore reprehenderit doloribus exercitationem id
                        </Timeline.Item.Content>
                    </Timeline.Item>
                </Timeline>
            </div>
            <div className='mt-20'>
                <p>#2: Timeline with custom content:</p>
                <Timeline renderOpposite={false} className='mt-10'>
                    {items.map((item) => (
                        <Timeline.Item key={item.title}>
                            <Timeline.Item.Content>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem consequatur minima delectus
                                maxime dolores quisquam ratione corrupti error reiciendis, beatae amet similique
                                provident inventore reprehenderit doloribus exercitationem id
                            </Timeline.Item.Content>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </div>
        </div>
    );
}
