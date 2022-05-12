import parties from './model/parties';
import './App.css';
import states from './model/states';
import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


function App() {

  const [approvingParties, setApprovingParties] = useState([]);

  console.log(approvingParties);

  const statesWithApproval = states.map(state => ({
    approval: state.gov.every(party => approvingParties.includes(party)),
    ...state
  })
  )
  
  const approvingStates = statesWithApproval.filter(state => state.approval);

  const totalSeats = states.map(state => state.seats).reduce((a, b) => a + 6);
  
  const totalSeatsApproval = approvingStates.length == 0 ? 0 : approvingStates.map(state => state.seats).reduce((a, b) => a + 6);

  console.log(approvingStates);
  
  function onValueChange(event) {
    console.log(event.target.value)
    if(!event.target.value.localeCompare("yes")) {
      setApprovingParties([event.target.name, ...approvingParties]);
    } else {
      setApprovingParties(approvingParties.filter(party => party.localeCompare(event.target.name)));
    }
  }

  return (
    <div className="container flex flex-col items-center m-auto">
      <div className="mt-16 mb-8">
        <h1 class="text-4xl">Bundesrat Abstimmungsrechner</h1>
      </div>
      <div className="mt-8 mb-16">
        <h1 class="text-xl">
          <CircularProgressbar styles={buildStyles({textSize: "12px", pathColor: totalSeatsApproval > (totalSeats / 2) ? '#15803d' : '#b91c1c'})} value={100 * totalSeatsApproval / totalSeats} text={totalSeatsApproval.toString().concat(" / ").concat(totalSeats).concat(" Sitze")} />
          
        </h1>
      </div>
      <div className="flex w-full">
        <div className="w-1/2 rounded-lg overflow-hidden mr-6">
          <table>
            <tr className="bg-gray-200 ">
              <th className="w-full text-left py-2 px-4">
                Partei
              </th>
              <th className="text-right py-2 px-4">
                Abstimmungsverhalten
              </th>
            </tr>
            { parties.map(party => (
              <tr className="bg-gray-100">
                <td className="py-2 px-4">
                  <img src={party.logo} alt="" className="inline w-12 mr-3" />
                  {party.name}
                </td>
                <td className="text-right py-2 px-4">
                  <div onChange={onValueChange}>
                  <p>
                    ✅
                    <input type="radio" name={party.id} value="yes" className="ml-2" />
                  </p>
                  <p>
                    🚫
                    <input type="radio" name={party.id} value="no" className="ml-2" />
                  </p>
                  </div>
                </td>
              </tr>
            )) }

          </table>
        </div>
        <div className="w-1/2 rounded-lg overflow-hidden ml-6">
          <table>
            <tr className="bg-gray-200 ">
              <th className="text-left w-1/3 py-2 px-4">
                Bundesland
              </th>
              <th className="text-left w-1/3 py-2 px-4">
                Regierung 
              </th>
              <th className="text-right py-2 px-4">
                Abstimmungsverhalten
              </th>
            </tr>
            { statesWithApproval.map(state => (
            <tr className="bg-gray-100">
              <td className="py-2 px-4 w-1/3 flex">
                <div className="flex items-center">
                  {state.name}
                </div>
              </td>
              <td className="w-1/3 py-2 px-4">
                <div className="flex">
                {state.gov.map(partyName => {
                  const party = parties.filter(party => !party.id.localeCompare(partyName))[0];
                  return (
                    <div className="ml-2 flex items-center">
                      <img src={party.logo} className="w-12" alt="" />
                    </div>)
                  }
                )}
                </div>
              </td>
              <td className="text-right py-2 px-4 text-3xl">
                {
                  state.approval ? '✅' : '❌'
                }
              </td>
            </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
