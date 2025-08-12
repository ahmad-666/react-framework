import Tooltip from '.';

export default function TooltipExample() {
    return (
        <div>
            <Tooltip content='Tooltip' position='left-top'>
                <button>hover me</button>
            </Tooltip>
        </div>
    );
}
