import React from 'react';

export const Prize = ({ onBack }) => {
    const [quote, setQuote] = React.useState('');
    const [image, setImage] = React.useState('');

    React.useEffect(() => {
        fetch('https://api.quotable.io/random')
            .then(response => response.json())
            .then(data => setQuote(data.content))
            .catch(error => console.log(error));
    }, []);

    React.useEffect(() => {
        fetch('https://dog.ceo/api/breeds/image/random')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    setImage(data.message);
                } else {
                    fetch('https://randomfox.ca/floof/?ref=apilist.fun')
                        .then(response => response.json())
                        .then(data => setImage(data.image))
                        .catch(error => console.log(error));
                }
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <div className='h-full flex flex-col'>
            <button className='absolute box-glow p-2 m-2' onClick={onBack}>Back</button>
            <h1 className='text-xl text-center py-4'>Congratulations!</h1>
            <div className='flex-1 overflow-y-auto'>
                <p className='text-center text-base px-4 mb-4'>
                    You are among the select few who have solved this puzzle. Please enjoy this picture and quote of the day!
                </p>

                <p className='text-center text-base px-4 mb-4'>{quote}</p>
                <img
                    src={image}
                    alt='prize'
                    className='mx-auto my-4 max-w-full h-auto max-h-[150px] object-contain'
                />
            </div>
        </div>
    );
};

export default Prize;