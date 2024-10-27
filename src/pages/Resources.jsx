import React from 'react';
import { useNavigate } from 'react-router-dom';

const Resources = () => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1); // This will take the user back to the previous page
    };

    return (
        <div className="resources-container">
            
            <h1 className="resources-title">Mental Health Resources at UNC Charlotte</h1>
            <p className="resources-intro">
                UNC Charlotte offers various mental health resources to support students' well-being. Below are the key services available:
            </p>

            <div className="resource-section">
                <h2 className="resource-heading">Counseling and Psychological Services (CAPS)</h2>
                <p className="resource-description">
                    CAPS provides individual counseling, group therapy, and workshops to help students address mental health concerns.
                </p>
                <ul className="resource-list">
                    <li><strong>Website:</strong> <a className="resource-link" href="https://caps.uncc.edu" target="_blank" rel="noopener noreferrer">caps.uncc.edu</a></li>
                    <li><strong>Address:</strong> 3800 Coliseum Dr, Charlotte, NC 28212</li>
                    <li><strong>Phone:</strong> <a className="resource-link" href="tel:704-687-0311">(704) 687-0311</a></li>
                </ul>
            </div>

            <div className="resource-section">
                <h2 className="resource-heading">Wellness Center</h2>
                <p className="resource-description">
                    The Wellness Center offers wellness education, resources, and programs to promote mental and physical health.
                </p>
                <ul className="resource-list">
                    <li><strong>Website:</strong> <a className="resource-link" href="https://wellness.uncc.edu" target="_blank" rel="noopener noreferrer">wellness.uncc.edu</a></li>
                    <li><strong>Address:</strong> 9201 University City Blvd, Charlotte, NC 28223</li>
                    <li><strong>Phone:</strong> <a className="resource-link" href="tel:704-687-7400">(704) 687-7400</a></li>
                </ul>
            </div>

            <div className="resource-section">
                <h2 className="resource-heading">Mental Health Emergencies</h2>
                <p className="resource-description">
                    For urgent mental health care, contact CAPS during business hours or call local emergency services.
                </p>
                <ul className="resource-list">
                    <li><strong>Emergency Services:</strong> <a className="resource-link" href="tel:911">911</a></li>
                    <li><strong>CAPS Crisis Line:</strong> <a className="resource-link" href="tel:704-687-0311">(704) 687-0311</a></li>
                </ul>
            </div>

            <div className="resource-section">
                <h2 className="resource-heading">Online Resources</h2>
                <p className="resource-description">
                    Access online resources and self-help tools for mental health.
                </p>
                <ul className="resource-list">
                    <li><strong>Website:</strong> <a className="resource-link" href="https://caps.uncc.edu/self-help" target="_blank" rel="noopener noreferrer">Self-Help Resources</a></li>
                </ul>
            </div>

            <div className="resource-section">
                <h2 className="resource-heading">Student Health Center</h2>
                <p className="resource-description">
                    Provides health services, including mental health screenings and referrals to CAPS.
                </p>
                <ul className="resource-list">
                    <li><strong>Website:</strong> <a className="resource-link" href="https://studenthealth.charlotte.edu/" target="_blank" rel="noopener noreferrer">Student Health Center</a></li>
                    <li><strong>Address:</strong> 9201 University City Blvd, Charlotte, NC 28223</li>
                    <li><strong>Phone:</strong> <a className="resource-link" href="tel:704-687-7400">(704) 687-7400</a></li>
                </ul>
            </div>
            <button className="back-button" onClick={handleBackClick}>
                Back
            </button>


            
        </div>
    );
};

export default Resources;
