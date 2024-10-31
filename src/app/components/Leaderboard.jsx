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

                const top = creditData.length > 0 ? creditData.length - 1 : null;

                if (summary.length && creditData.length) {
                    const userData = {
                        UserID: userId,
                        Name : name, 
                        totalEmissionFactor: summary[0].totalEmissionFactor,
                        totalCarbonFootprint: summary[0].totalCarbonFootprint,
                        totalDistanceTravelled: summary[0].totalDistanceTravelled,
                        creditPoints: creditData[top].creditPoints
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

    console.log(leaderboardData)

    return (
        <div>
            {loading ? (
                <p>Loading leaderboard...</p>
            ) : (
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-200 border-b border-gray-300">
                            <th className="px-4 py-2 border-r border-gray-300">Username</th>
                            <th className="px-4 py-2 border-r border-gray-300">Total Emission Factor</th>
                            <th className="px-4 py-2 border-r border-gray-300">Total Carbon Footprint</th>
                            <th className="px-4 py-2 border-r border-gray-300">Total Distance Travelled</th>
                            <th className="px-4 py-2">Credit Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((user, index) => (
                            <tr key={index} className="odd:bg-white even:bg-gray-50 border-b border-gray-300">
                                <td className="px-4 py-2 border-r border-gray-300">{user.Name}</td>
                                <td className="px-4 py-2 border-r border-gray-300">{user.totalEmissionFactor}</td>
                                <td className="px-4 py-2 border-r border-gray-300">{user.totalCarbonFootprint}</td>
                                <td className="px-4 py-2 border-r border-gray-300">{user.totalDistanceTravelled}</td>
                                <td className="px-4 py-2">{user.creditPoints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}