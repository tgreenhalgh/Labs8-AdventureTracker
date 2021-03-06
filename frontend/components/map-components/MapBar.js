import React, { Component } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormArea } from '../styles/FormStyles';
import { CURRENT_USER_QUERY } from '../User';
const ProgressWrapper = styled.div`
  display: flex;
  position: relative;
  height: 3rem;
  width: 30%;
  background: ${props => props.theme.white};
`;
const ProgressBar = styled.div`
  display: flex;
  height: 100%;
  width: ${props => props.width};
  background: green;
`;
const ProgressStats = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: ${props => props.theme.black};
  font-weight: bold;
`;
const MapBarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  width: 100%;
  height: 9rem;
  background: ${props => props.theme.blue};
  color: ${props => props.theme.white};
`;

const AdventureTitle = styled.h2`
  margin-left: 1em;
  word-wrap: break-word;
`;
const TitleBox = styled(FormArea)``;
const CalendarGroup = styled.div`
  display: flex;
  align-items: center;
`;
const CalendarLabel = styled.label`
  padding: 0 1em 0 0;
`;
const CalendarInput = styled(DatePicker)`
  display: flex;
  justify-content: center;
  height: 2em;
  text-align: center;
  padding: 0 1rem;
  max-width: 10rem;
`;
const MapBtn = styled.button`
  background: ${props => props.theme.lightorange};
  color: ${props => props.theme.black};
  padding: 0.5em;
  font-size: 2rem;
  margin: 1rem;
  width: 15rem;
  cursor: pointer;
  border: none;
`;
const CalendarWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-end;
`;

const UPDATE_TRIP_MUTATION = gql`
  mutation UPDATE_TRIP_MUTATION(
    $title: String!
    $startDate: DateTime!
    $endDate: DateTime!
    $tripId: ID! # $user: UserWhereUniqueInput!
  ) {
    updateTrip(title: $title, startDate: $startDate, endDate: $endDate, tripId: $tripId) {
      id
    }
  }
`;

class MapBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tripTitle: 'My Trip'
    };
  }
  componentDidMount() {
    this.setState({ tripTitle: this.props.title });
  }
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const progressFormula = (this.props.completedChecks / this.props.markerAmount) * 100;
    return (
      <MapBarWrapper>
        <AdventureTitle>
          {this.props.title ? (
            this.props.title
          ) : (
            <TitleBox
              type="text"
              name="tripTitle"
              placeholder="Trip Title"
              id="tripTitle"
              value={this.state.tripTitle}
              onChange={e => {
                this.saveToState(e);
              }}
            />
          )}
        </AdventureTitle>
        <ProgressWrapper>
          <ProgressBar width={this.props.completedChecks === 0 ? '0%' : `${progressFormula}%`}>
            <ProgressStats>
              {this.props.completedChecks} of {this.props.markerAmount} Completed
            </ProgressStats>
          </ProgressBar>
        </ProgressWrapper>
        <CalendarWrapper>
          <CalendarGroup>
            <CalendarLabel htmlFor="start">Start Date:</CalendarLabel>
            {/* example: <input id="date" type="date" value="2017-06-01"> */}
            <CalendarInput
              id="start"
              type="date"
              placeholderText="Start Date"
              onSelect={this.props.setStartDate}
              selected={this.props.startDate}
              name="startDate"
              onKeyDown={e => {
                e.preventDefault();
              }}
            />
          </CalendarGroup>
          <CalendarGroup>
            <CalendarLabel htmlFor="end">End Date:</CalendarLabel>
            <CalendarInput
              placeholderText="End Date"
              name="endDate"
              id="end"
              onSelect={this.props.setEndDate}
              onKeyDown={e => {
                e.preventDefault();
              }}
              selected={this.props.endDate}
            />
          </CalendarGroup>
        </CalendarWrapper>
        <Mutation
          mutation={UPDATE_TRIP_MUTATION}
          refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          variables={{
            title: this.state.tripTitle,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            tripId: this.props.tripId
            // user: { id: '', email: '', facebookID: '' }
          }}
        >
          {(updateTrip, { error, loading }) => {
            if (loading) {
              return <p>{loading}</p>;
            }
            if (error) {
              return <p>{error}</p>;
            }
            return (
              <MapBtn
                onClick={async () => {
                  await updateTrip();
                  Router.push({ pathname: '/triplist' });
                }}
              >
                Save
                <br /> Trip
              </MapBtn>
            );
          }}
        </Mutation>
      </MapBarWrapper>
    );
  }
}

export default MapBar;
