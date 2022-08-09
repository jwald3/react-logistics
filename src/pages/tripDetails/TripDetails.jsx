import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import Sidebar from '../../components/sidebar/Sidebar'
import './tripDetails.scss'
import { useNavigate, useParams } from 'react-router-dom'
import Map from '../../components/map/Map'
import CustomCalendar from '../../components/customCalendar/CustomCalendar'
import InfoCard from '../../components/infoCard/InfoCard'
import { AppContext } from '../../App'

const TripDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [truckInfo, setTruckInfo] = useState([]);
    const [originFacilityInfo, setOriginFacilityInfo] = useState([]); 
    const [destinationFacilityInfo, setDestinationFacilityInfo] = useState([]); 
    const { facilityData, truckData, tripData } = useContext(AppContext);

    const navigate = useNavigate();

    useEffect(() => {
        const idResults = tripData.filter(trip => trip.id === id);

        if (idResults.length > 0) {
            setData(idResults[0]);
        } else {
            navigate("/404");
        }
    }, [])

    useEffect(() => {
        

        const tripTruck = truckData.filter(truck => truck.license === data.truck)[0];
        setTruckInfo(tripTruck);

        const tripOriginFacility = facilityData.filter(facility => facility.facilityName === data.originFacility)[0];
        setOriginFacilityInfo(tripOriginFacility);

        const tripDestinationFacility = facilityData.filter(facility => facility.facilityName === data.destinationFacility)[0];
        setDestinationFacilityInfo(tripDestinationFacility);
    }, [data])

    const timeDiffCalc = () => {
        let diffInMilliSeconds = Math.abs(new Date(data.endDate) - new Date(data.startDate)) / 1000;

        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;

        let difference = '';
        
        if (days > 0) {
            difference += (days === 1) ? `${days} day, ` : `${days} days, `;
        }

        if (hours > 0) {
            difference += (hours === 1) ? `${hours} hour, ` : `${hours} hours, `;
        }

        if (minutes > 0) {
            difference += (minutes === 1) ? `${minutes} minute` : `${minutes} minutes,`;
        }
         
        if (days === 0 && hours === 0 && minutes === 0) {
            difference += "No time"
        }

        return difference;
    }

    return (
        <div className="tripDetails">
            <Sidebar />
            <div className="tripContainer">
                <Navbar />
                <div className="tripView">
                    <div className="left">
                        <div className="left-top">
                            <div className="tripSummary">
                                <div className="path">
                                    <div className="facility originFacility">{data.originFacility}</div>
                                    <span>to</span>
                                    <div className="facility originFacility">{data.destinationFacility}</div>
                                </div>
                                <div className="dates">
                                    <div className="date startDate">{data.startDate}</div>
                                    <span>to</span>
                                    <div className="date endDate">{data.endDate}</div>
                                </div>
                                <div className="summary">
                                    {`${timeDiffCalc()} $${data.earnings}`}
                                </div>
                            </div>
                            <hr />
                        </div>
                        {
                            (truckInfo && originFacilityInfo && destinationFacilityInfo) &&
                            <div className="left-bottom">
                                <InfoCard resource="truck" heading="Truck" data={truckInfo} />
                                <InfoCard resource="facility" heading="Origin Facility" data={originFacilityInfo} />
                                <InfoCard resource="facility" heading="Destination Facility" data={destinationFacilityInfo} />
                            </div>
                        }
                    </div>
                    <div className="right">
                        <div className="right-top">
                            <Map />
                        </div>
                        <div className="right-bottom">
                            <CustomCalendar dateRange={[{
                                start: new Date(data.startDate),
                                end: new Date(data.endDate),
                                title: `${data.originFacility} to ${data.destinationFacility}`
                            }]}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TripDetails;