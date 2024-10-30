'use client';
import { useEffect, useState } from "react";
import { fetchDataTable2, fetchCreditPoints } from "../actions/fetchData";
import { account } from "../appwrite"; // Import Appwrite's account or users instance

async function fetchAllUserIds() {
    try {
        const result = await account.get();
        return { userId: result.$id, name: result.name }; 
    } catch (error) {
        console.error("Error fetching user IDs from authentication:", error);
        throw new Error("Could not fetch user IDs.");
    }
}

export default function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                setLoading(true);

                const {userId , name}= await fetchAllUserIds(); 
                const leaderboard = [];

                const summary = await fetchDataTable2(userId);
                const creditData = await fetchCreditPoints(userId);

                if (summary.length && creditData.length) {
                    const userData = {
                        UserID: userId,
                        totalEmissionFactor: summary[0].totalEmissionFactor,
                        totalCarbonFootprint: summary[0].totalCarbonFootprint,
                        totalDistanceTravelled: summary[0].totalDistanceTravelled,
                        creditPoints: creditData[0].creditPoints
                    };

                    leaderboard.push(userData);
                }

                // leaderboard.sort((a, b) => b.creditPoints - a.creditPoints);
                setLeaderboardData(leaderboard);
            } catch (error) {
                console.error("Error fetching leaderboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, []);

    return (
        <div>
            <h1>Leaderboard</h1>
            {loading ? (
                <p>Loading leaderboard...</p>
            ) : (
                <table>
                    <thead >
                        <tr>
                            <th className="px-2.5">Username</th>
                            <th className="px-2.5">Total Emission Factor</th>
                            <th className="px-2.5">Total Carbon Footprint</th>
                            <th className="px-2.5">Total Distance Travelled</th>
                            <th className="px-2.5">Credit Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((user, index) => (
                            <tr key={index}>
                                <td className="px-2.5">{user.name}</td>
                                <td className="px-2.5">{user.totalEmissionFactor}</td>
                                <td className="px-2.5">{user.totalCarbonFootprint}</td>
                                <td className="px-2.5">{user.totalDistanceTravelled}</td>
                                <td className="px-2.5">{user.creditPoints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}