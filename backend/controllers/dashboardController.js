import Property from '../models/Property.js';
import Lead from '../models/Lead.js';
import ContactMessage from '../models/ContactMessage.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [totalProperties, featuredCount, totalLeads, newLeads, totalContacts, newContacts] =
      await Promise.all([
        Property.countDocuments(),
        Property.countDocuments({ featured: true }),
        Lead.countDocuments(),
        Lead.countDocuments({ createdAt: { $gte: since24h } }),
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ createdAt: { $gte: since24h } }),
      ]);

    const recentLeads = await Lead.find()
      .populate('property', 'title slug')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const recentContacts = await ContactMessage.find().sort({ createdAt: -1 }).limit(8).lean();

    const unreadLeads = await Lead.countDocuments({ read: false });
    const unreadContacts = await ContactMessage.countDocuments({ read: false });

    const byType = await Property.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const timeline = [
      ...recentLeads.map((l) => ({
        kind: 'lead',
        at: l.createdAt,
        title: l.name,
        subtitle: l.propertyTitle || 'General inquiry',
      })),
      ...recentContacts.map((c) => ({
        kind: 'contact',
        at: c.createdAt,
        title: c.name,
        subtitle: c.message?.slice(0, 80),
      })),
    ]
      .filter((x) => x.at)
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 12);

    res.json({
      totalProperties,
      featuredProperties: featuredCount,
      totalLeads,
      newLeads24h: newLeads,
      totalContacts,
      newContacts24h: newContacts,
      unreadLeads,
      unreadContacts,
      notificationCount: unreadLeads + unreadContacts,
      recentLeads,
      recentContacts,
      chartByType: byType.map((x) => ({ name: x._id, value: x.count })),
      timeline,
    });
  } catch (e) {
    next(e);
  }
};
