import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';

interface Props {
    previous: () => void;
    next: () => void;
}

const CarouselButtonsComponent: React.FC<Props> = ({ previous, next }) => {
    return (
        <div>
            <button aria-label="Go to previous slide" type="button" onClick={previous}>
                <ArrowCircleLeftTwoToneIcon sx={{ fontSize: '50px', fill: 'white' }} className='absolute bottom-24 -left-14 z-10' />
                <div className='arrowBox absolute bottom-24 -left-14 flex justify-center items-center' >
                    <div className='arrowBtn' ></div>
                </div>
            </button>
            <button aria-label="Go to next slide" type="button" onClick={next}>
                <ArrowCircleRightTwoToneIcon sx={{ fontSize: '50px', fill: 'white' }} className='absolute bottom-24 -right-14 z-10' />
                <div className='arrowBox absolute bottom-24 -right-14 flex justify-center items-center' >
                    <div className='arrowBtn' ></div>
                </div>
            </button>
        </div>
    );
};

export default CarouselButtonsComponent;
