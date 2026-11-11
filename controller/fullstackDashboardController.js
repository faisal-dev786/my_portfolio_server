import FullstackContact from "../models/fullstackContact.js";
import FullstackMeeting from "../models/fullstackMeeting.js";
import GraphixContact from "../models/graphixContact.js";
import QuranAcademyContact from "../models/quranAcademyContact.js";
import VisualsContact from "../models/visualsContact.js";
import VisualsEmailContact from "../models/visualsEmailContact.js";

const formSources = [
    {
        type: "fullstackContact",
        label: "Fullstack Contact",
        model: FullstackContact,
        fields: "firstName lastName email message",
        getName: (entry) => `${entry.firstName} ${entry.lastName}`,
        getDetails: (entry) => entry.message
    },
    {
        type: "fullstackMeeting",
        label: "Fullstack Meeting",
        model: FullstackMeeting,
        fields: "email profession",
        getName: (entry) => entry.profession,
        getDetails: (entry) => entry.profession
    },
    {
        type: "graphixContact",
        label: "Graphix Contact",
        model: GraphixContact,
        fields: "name email message",
        getName: (entry) => entry.name,
        getDetails: (entry) => entry.message
    },
    {
        type: "quranAcademyContact",
        label: "Quran Academy Contact",
        model: QuranAcademyContact,
        fields: "name email message",
        getName: (entry) => entry.name,
        getDetails: (entry) => entry.message
    },
    {
        type: "visualsContact",
        label: "Visuals Contact",
        model: VisualsContact,
        fields: "firstName lastName name email message",
        getName: (entry) =>
            entry.firstName && entry.lastName
                ? `${entry.firstName} ${entry.lastName}`
                : entry.name,
        getDetails: (entry) => entry.message
    },
    {
        type: "visualsEmailContact",
        label: "Visuals Email Contact",
        model: VisualsEmailContact,
        fields: "email",
        getName: (entry) => entry.email,
        getDetails: (entry) => "Email subscription"
    }
];

export const getFullstackDashboard = async (req, res) => {
    try {
        const now = new Date();
        const firstMonth = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1)
        );
        const nextMonth = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
        );

        const formStats = await Promise.all(
            formSources.map(async (source) => {
                const [count, monthlyCounts, recentEntries] = await Promise.all([
                    source.model.countDocuments(),
                    source.model.aggregate([
                        { $match: { createdAt: { $gte: firstMonth, $lt: nextMonth } } },
                        {
                            $group: {
                                _id: {
                                    $dateToString: {
                                        format: "%Y-%m",
                                        date: "$createdAt",
                                        timezone: "UTC"
                                    }
                                },
                                count: { $sum: 1 }
                            }
                        }
                    ]),
                    source.model.find()
                        .sort({ createdAt: -1 })
                        .limit(10)
                        .select(`${source.fields} createdAt`)
                        .lean()
                ]);

                return { source, count, monthlyCounts, recentEntries };
            })
        );

        const graph = Array.from({ length: 6 }, (_, index) => {
            const monthDate = new Date(
                Date.UTC(firstMonth.getUTCFullYear(), firstMonth.getUTCMonth() + index, 1)
            );
            const month = monthDate.toISOString().slice(0, 7);
            const monthStats = { month };

            for (const { source, monthlyCounts } of formStats) {
                monthStats[source.type] =
                    monthlyCounts.find((item) => item._id === month)?.count ?? 0;
            }

            monthStats.total = formStats.reduce(
                (total, { source }) => total + monthStats[source.type],
                0
            );

            return monthStats;
        });

        const table = formStats
            .flatMap(({ source, recentEntries }) =>
                recentEntries.map((entry) => ({
                    id: entry._id,
                    type: source.type,
                    form: source.label,
                    name: source.getName(entry),
                    email: entry.email,
                    details: source.getDetails(entry),
                    createdAt: entry.createdAt
                }))
            )
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10);

        const byForm = formStats.map(({ source, count }) => ({
            type: source.type,
            label: source.label,
            count
        }));

        return res.status(200).json({
            summary: {
                totalSubmissions: byForm.reduce((total, form) => total + form.count, 0),
                byForm
            },
            graph,
            pieChart: byForm.map(({ type, label, count }) => ({
                type,
                label,
                value: count
            })),
            table
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
};
