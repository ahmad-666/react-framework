import SparkLine from '.';

export default function SparkLineExample() {
    return (
        <div>
            <SparkLine
                width={300}
                height={200}
                padding={5}
                data={[10, 20, 10, 0, 30, 50, 25, 15, 50]}
                strokeColor='red'
                strokeWidth={2}
                smooth
                smoothFactor={0.15}
                strokeGradient={['salmon', 'teal']}
                strokeGradientDirection='right'
                autoDraw
                fill
                fillGradient={['orange', 'transparent']}
                fillGradientDirection='bottom'
            />
        </div>
    );
}
