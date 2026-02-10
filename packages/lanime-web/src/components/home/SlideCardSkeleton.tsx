import Skeleton from '../common/Skeleton'

interface SlideCardSkeletonProps {
    index: number
}

const SlideCardSkeleton: React.FC<SlideCardSkeletonProps> = ({ index }) => {
    return (
        <div
            key={index}
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <Skeleton wt={'100%'} ht={'100%'} />
        </div>
    )
}

export default SlideCardSkeleton
