import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

const Bottom = () => {

    const { i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    return (
        <div>
            <div className="language">
                <Button variant="primary" className="main_button" onClick={() => changeLanguage('pl')}>Polski</Button>
                <Button variant="primary" className="main_button" onClick={() => changeLanguage('en')}>English</Button>
            </div>
        </div>
    );
};

export default Bottom;
